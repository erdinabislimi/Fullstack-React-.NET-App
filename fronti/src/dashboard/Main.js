import React, { useState, useEffect } from "react"; 
import { Link } from "react-router-dom";

import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsFillBellFill,
} from "react-icons/bs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Main() {
  const [bookCount, setBookCount] = useState(0);
  const [klientCount, setKlientCount] = useState(0);
  const [exchangeCount, setExchangeCount] = useState(0);
  const [stafiCount, setStafiCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookResponse = await fetch("https://localhost:7101/api/Libri/count");
        if (bookResponse.ok) {
          const bookData = await bookResponse.json();
          setBookCount(bookData.count);
        } else {
          throw new Error("Failed to fetch book count");
        }

        const klientResponse = await fetch("https://localhost:7101/api/Klient/count");
        if (klientResponse.ok) {
          const klientData = await klientResponse.json();
          setKlientCount(klientData.count);
        } else {
          throw new Error("Failed to fetch klient count");
        }

        const exchangeResponse = await fetch("https://localhost:7101/api/Exchange/count");
        if (exchangeResponse.ok) {
          const exchangeData = await exchangeResponse.json();
          setExchangeCount(exchangeData.count);
        } else {
          throw new Error("Failed to fetch exchange count");
        }

        const stafiResponse = await fetch("https://localhost:7101/api/Stafi/count");
        if (stafiResponse.ok) {
          const stafiData = await stafiResponse.json();
          setStafiCount(stafiData.count);
        } else {
          throw new Error("Failed to fetch stafi count");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const data = [
    { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
    { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
    { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
    { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
    { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
  ];

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>DASHBOARD</h3>
      </div>

      <div className="main-cards">
        <div className="card" style={{ backgroundColor: '#001524' }}>
          <Link to="/libri" className="card-link">
            <div className="card-inner"  >
              <h3  style={{ color: 'white' }}>Books</h3>
              <BsFillArchiveFill className="card_icon" style={{ backgroundColor: 'white' }}/>
            </div>
            <h1 style={{ color: 'white' }}>{bookCount}</h1>
          </Link>
        </div>
        
        <div className="card">
          <Link to="/klienti" className="card-link">
            <div className="card-inner">
              <h3>Customers</h3>
              <BsPeopleFill className="card_icon" />
            </div>
            <h1>{klientCount}</h1>
          </Link>
        </div>
        
        <div className="card">
        <Link to="/exchangeList" className="card-link">
          <div className="card-inner">
            <h3>Exchange</h3>
            <BsFillBellFill className="card_icon" style={{ backgroundColor: 'white' }} />
          </div>
          <h1>{exchangeCount}</h1>
          </Link>
        </div>
        
        <div className="card">
        <Link to="/staf" className="card-link">
          <div className="card-inner">
            <h3>Stafi</h3>
            <BsFillBellFill className="card_icon" />
          </div>
          <h1>{stafiCount}</h1>
        </Link>
        </div>
        
      </div>

      <div className="charts">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pv" fill="#001524" />
            <Bar dataKey="uv" fill="#762b47" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="pv"
              stroke="#001524"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="uv" stroke="#762b47" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}

export default Main;
