import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LineChart from './Components/LineChart';
import PieChart from './Components/PieChart.js';  
import './App.css';

function App() {
  const [country, setCountry] = useState('India');
  const [countriesList, setCountriesList] = useState([]);
  
  const [data, setData] = useState(null);
  const [yearlyData, setYearlyData] = useState({ years: [], cases: [], deaths: [], recoveries: [] });
  const [totalCases, setTotalCases] = useState(0);
  const [deaths, setDeaths] = useState(0);
  const [recoveries, setRecoveries] = useState(0);

  useEffect(() => {
    const fetchCountriesList = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const countriesData = response.data;
        const countryNames = countriesData.map(country => country.name.common);
        setCountriesList(countryNames);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountriesList();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://disease.sh/v3/covid-19/historical/${country}?lastdays=1500`);
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [country]);

  useEffect(() => {
    if (data && data.timeline) {
      const timeline = data.timeline;
      const years = [...new Set(Object.keys(timeline.cases).map(date => date.split('/')[2]))];

      const casesByYear = [];
      const deathsByYear = [];
      const recoveriesByYear = [];

      let totalCases = 0;
      let totalDeaths = 0;
      let totalRecoveries = 0;

      years.forEach(year => {
        const lastDateOfYear = Object.keys(timeline.cases).filter(date => date.endsWith('/' + year)).pop();
        casesByYear.push(timeline.cases[lastDateOfYear]);
        deathsByYear.push(timeline.deaths[lastDateOfYear]);
        recoveriesByYear.push(timeline.recovered[lastDateOfYear]);

        totalCases += timeline.cases[lastDateOfYear];
        totalDeaths += timeline.deaths[lastDateOfYear];
        totalRecoveries += timeline.recovered[lastDateOfYear];
      });

      setTotalCases(totalCases);
      setDeaths(totalDeaths);
      setRecoveries(totalRecoveries);

      setYearlyData({ years: years, cases: casesByYear, deaths: deathsByYear, recoveries: recoveriesByYear });
    }
  }, [data]);

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  return (
    <>
      <div className='maindiv'>
        <h1 className='header'>Covid19 Dashboard</h1>
        <div className='container'>
        
          <div className='country-selector'>
            <select value={country} onChange={handleCountryChange}>
              {countriesList.map((countryName, index) => (
                <option key={index} value={countryName}>{countryName}</option>
              ))}
            </select>
          </div>

          <div className='totals'>
            <p id='cases'>Total Cases: {totalCases}</p>
            <p id='deaths'>Deaths: {deaths}</p>
            <p id='recoveries'>Recoveries: {recoveries}</p>
          </div>

          <div className='inner-container'>
            
            <div className='linechart'>
              {yearlyData.cases.length > 0 && (
                <>
                  <LineChart data={yearlyData} />
                </>
              )}
            </div>


            <div className='piechart'>
              {yearlyData.cases.length > 0 && (
                <>
                  <PieChart data={yearlyData} />
                </>
              )}
            </div>
          </div>
        </div>

      </div>
      
    </>
  )
}

export default App;
