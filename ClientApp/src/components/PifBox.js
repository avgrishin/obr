import React, { useState, useEffect } from 'react'
import './Pifer.css'

const Pif = props => (
  <tr>
    <td>{ props.date }</td>
    <td>{ props.name }</td>
    <td className="ta-r">{ props.pricePai }</td>
    <td className="ta-r" style={{ color: props.pricePaiD < 0 ? 'red' : 'green' }}>{ props.pricePaiD.toFixed(3) }%</td>
    <td className="ta-r">{ props.scha }</td>
    <td className="ta-r" style={{ color: props.schad < 0 ? 'red' : 'green' }}>{ props.schad.toFixed(3) }%</td>
  </tr>
)
  
const PifList = props => (
  <table className="table table-sm fp-currency table1"><tbody>
    { console.log(props) }
    { props.data.map(result => <Pif key={result.name} {...result} />) }
  </tbody></table>
)

export function PifBox(props) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { document.title = 'ПИФы' })
  useEffect(() => {
    const fetchData = async() => {
      const response = await fetch('api/RepWA/GetData/3', { credentials: 'include' })
      const result = await response.json();
      setData(result);
      setLoading(false);
    };
    fetchData();
  }, []);
  return (
    <div>
      <h2>Фонды</h2>
      { loading ? <p><em>Загрузка...</em></p> : <PifList data={ data } /> }
    </div>
  );
}
