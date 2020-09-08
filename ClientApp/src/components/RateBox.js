import React, { useState, useEffect } from 'react';

const Rate = props => (
  <tr>
    <td>{ props.sec }</td>
    <td className="ta-r">{ props.cl }</td>
    <td className="ta-r" style={{ color: props.chg < 0 ? 'red' : 'green' }}>{ props.chg.toFixed(2) }</td>
    <td>{ props.tm }</td>
  </tr>
)
  
const RateList = props => (
  <table className="table table-sm fp-currency table1" style={{ width: 300 }}><tbody>
    { props.data.map(result => <Rate key={ result.sec } { ...result } />) }
  </tbody></table>
)

export function RateBox() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { document.title = 'Курсы MOEX' })
  useEffect(() => {
    const fetchData = async() => {
      const response = await fetch('api/RepWA/GetData/2', { credentials: 'include' })
      const result = await response.json();
      setData(result);
      setLoading(false);
    };
    fetchData();
  }, []);
  return (
    <div>
      <h2>Курсы MOEX</h2>
      { loading ? <p><em>Загрузка...</em></p> : <RateList data={ data } /> }
    </div>
  );
}
