import React, { useState, useEffect, useCallback } from 'react';
// import './MarketDataPage.css'; // Will create this later

function MarketDataPage() {
  const [overviewStats, setOverviewStats] = useState(null);
  const [avgPriceByType, setAvgPriceByType] = useState(null);
  const [avgPriceByBedrooms, setAvgPriceByBedrooms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cityFilter, setCityFilter] = useState(''); // State for city filter

  const fetchMarketData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch overview stats
      const overviewResponse = await fetch('/api/properties/stats/overview');
      const overviewData = await overviewResponse.json();
      if (!overviewResponse.ok) {
        throw new Error(overviewData.error || 'Failed to fetch overview stats');
      }
      setOverviewStats(overviewData);

      // Fetch average price by type
      if (cityFilter) { // Only fetch if city filter is set
        const typeResponse = await fetch(`/api/properties/stats/average-price-by-type?city=${cityFilter}`);
        const typeData = await typeResponse.json();
        if (!typeResponse.ok) {
          throw new Error(typeData.error || 'Failed to fetch average price by type');
        }
        setAvgPriceByType(typeData);

        // Fetch average price by bedrooms
        const bedroomsResponse = await fetch(`/api/properties/stats/average-price-by-bedrooms?city=${cityFilter}`);
        const bedroomsData = await bedroomsResponse.json();
        if (!bedroomsResponse.ok) {
          throw new Error(bedroomsData.error || 'Failed to fetch average price by bedrooms');
        }
        setAvgPriceByBedrooms(bedroomsData);
      } else {
        setAvgPriceByType(null);
        setAvgPriceByBedrooms(null);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [cityFilter]); // fetchMarketData depends on cityFilter

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]); // fetchMarketData is now a stable dependency

  if (loading && !overviewStats) { // Show loading only initially or when city filter changes
    return <p>Loading market data...</p>;
  }

  if (error) {
    return <p className="error">Error: {error}</p>;
  }

  return (
    <div className="market-data-page">
      <h2>Market Data & Analytics</h2>

      <div className="stats-section">
        <h3>Overview</h3>
        {overviewStats ? (
          <div>
            <p>Total Properties: {overviewStats.totalProperties}</p>
            <p>For Sale: {overviewStats.forSale}</p>
            <p>For Rent: {overviewStats.forRent}</p>
            <p>Premium Listings: {overviewStats.premium}</p>
            {overviewStats.avgPrice && (
              <>
                <p>Average Sale Price: {overviewStats.avgPrice.sale} USD</p>
                <p>Average Rent Price: {overviewStats.avgPrice.rent} USD</p>
              </>
            )}
            <p>Cities: {overviewStats.cities.join(', ')}</p>
            <p>Property Types: {overviewStats.propertyTypes.join(', ')}</p>
          </div>
        ) : (
          <p>No overview data available.</p>
        )}
      </div>

      <div className="city-filter-section">
        <h3>Filter by City for Detailed Stats</h3>
        <input
          type="text"
          placeholder="Enter City Name"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        />
        <button onClick={() => fetchMarketData()}>Apply City Filter</button>
        {!cityFilter && <p>Enter a city to see detailed average prices.</p>}
      </div>

      {cityFilter && (
        <>
          <div className="stats-section">
            <h3>Average Price by Property Type in {cityFilter}</h3>
            {avgPriceByType && avgPriceByType.length > 0 ? (
              <ul>
                {avgPriceByType.map(item => (
                  <li key={item.propertyType}>
                    {item.propertyType}: {item.averagePrice} USD (Count: {item.count})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No data for property types in {cityFilter}.</p>
            )}
          </div>

          <div className="stats-section">
            <h3>Average Price by Bedrooms in {cityFilter}</h3>
            {avgPriceByBedrooms && avgPriceByBedrooms.length > 0 ? (
              <ul>
                {avgPriceByBedrooms.map(item => (
                  <li key={item.bedrooms}>
                    {item.bedrooms} Bedrooms: {item.averagePrice} USD (Count: {item.count})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No data for bedrooms in {cityFilter}.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default MarketDataPage;
