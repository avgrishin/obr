import React, { useState, useEffect } from 'react';

const Course = props => (
  <tr>
    <td>{ props.dt.substr(0, 10).replace(/(\d+)-(\d+)-(\d+)/, '$3.$2.$1') }</td>
    <td>{ props.s }</td>
    <td className="ta-r">{ props.c.toFixed(4) }</td>
    <td className="ta-r" style={{ color: props.y < 0 ? 'red' : 'green' }}>{ props.y.toFixed(4) }</td>
  </tr>
)

const CourseList = props => (
  <table className="table table-sm fp-currency table1"><tbody>
    { props.data.map(result => <Course key={ result.s } { ...result } />) }
  </tbody></table>
)

export const CourseBox = props => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { document.title = 'Курсы ЦБ' })
  useEffect(() => {
    const fetchData = async() => {
      const response = await fetch('api/RepWA/GetData/1', { credentials: 'include' })
      const result = await response.json();
      setData(result);
      setLoading(false);
    };
    fetchData();
  }, []);
  return (
    <div>
      <h2>Курсы валют ЦБ РФ</h2>
      { loading ? <p><em>Загрузка...</em></p> : <CourseList data={ data } /> }
    </div>
  );
}
