import React, { useEffect, useReducer } from 'react';
import { Col, Row } from 'reactstrap'
// import { Line } from 'react-chartjs-2'
import DatePicker, { registerLocale } from "react-datepicker";
import MaskedInput from 'react-maskedinput';
import PiferAutocomplete from './PiferAutocomplete'
import ru from 'date-fns/locale/ru';
import "react-datepicker/dist/react-datepicker.css";
import LineGraph from './Chart'
import Discl from './Discl'
import './Pifer.css';
registerLocale("ru", ru); 

const PiferRest = props => {
  if (props.data.length === 0) {
    return null
  }
  let s = 0
  let p = 0
  return (
    <table className="table table-sm table1"><tbody>
      <tr><th>Фонд</th><th className="text-right">Кол-во</th><th className="text-right">Цена</th><th className="text-right">Стоимость</th><th className="text-right">PnL</th><th className="text-center">Доходность</th></tr>
      { 
        props.data.map(result => { 
          s = s + result.qty
          p += result.PnL
          return (<PiferRestItem key={result.id} { ...result } onClick={ e => { e.preventDefault(); props.onRestClick(props.id, result.id) } } onShowFondYield={ e => { e.preventDefault(); props.onShowFondYield(props.id, result.id) }} />)
        }) 
      }
      <tr><th colSpan="3">Итого</th><th className="text-right">{ s.toFixed(2) }</th><th className="text-right">{ p.toFixed(2) }</th><th>&nbsp;</th></tr>
    </tbody></table>
  )
}
const PiferRestItem = props => (
  <tr>
    <td><a href='#' onClick={ props.onClick } role="button">{ props.name }</a></td>
    <td className="text-right">{ props.num }</td>
    <td className="text-right">{ props.course }</td>
    <td className="text-right">{ props.qty.toFixed(2) }</td>
    <td className="text-right">{ props.PnL.toFixed(2) }</td>
    <td className="text-right">{ props.showYield ? ( <>{ props.Yielda.toFixed(2) }% <span className="small">({ props.Yield.toFixed(2) }% годовых)</span ></>) : (<a href='#' onClick={ props.onShowFondYield } role="button">Показать</a>) }</td>
  </tr>
)
const PiferTitle = props => {
  if (!props.brief) {
    return null
  }
  return (
    <div>
    <table className="table table-sm table1">
    <tbody>
      <tr><td className="active">ID</td><td>{ props.brief }</td></tr>
      <tr><td className="active">Фамилия</td><td>{ props.fam }</td></tr>
      <tr><td className="active">Имя</td><td>{ props.im }</td></tr>
      <tr><td className="active">Отчество</td><td>{ props.ot }</td></tr>
      <tr><td className="active">Дата рождения</td><td>{ props.bd }</td></tr>
      <tr><td className="active">Доходность</td><td>{ props.showYield ? ( <><span title='С начала управления'>{ props.Yielda.toFixed(2) }%</span> <span className="small">({ props.Yield.toFixed(2) }% годовых)</span></>) : (<a href='#' onClick={ e=> { e.preventDefault(); props.onShowYield(props.id) } } role="button">Показать</a>) }</td></tr>
    </tbody>
    </table>
    </div>
  )
}

const PiferOrd = props => {
  if (props.data.length === 0) {
    return null
  }
  let s = 0
  return (
    <div>
    <h3>Заявки по фонду {props.fond}</h3>
    <table className="table table-sm table1"><tbody>
      <tr><th>Фонд</th><th>Дата заявки</th><th>Дата расчета</th><th className="text-right">Кол-во</th><th className="text-right">Остаток</th><th className="text-right">Цена пая</th><th className="text-right">Стоимость</th><th className="text-right">Комиссия</th><th className="text-right">Налог</th><th>ППЗ</th><th>Тип</th><th>Операция</th><th>Состояние</th><th>Номер</th></tr>
      { props.data.map(result => {
        s += (result.dt === 1 ? 1 : -1)*result.num
        s = Math.round(s*100000)/100000
        return <PiferOrdItem key={ result.id } { ...result } s={ s } />} 
      )}
    </tbody></table>
    </div>
  )
}
const PiferOrdItem = props => (
  <tr>
    <td>{ props.name }</td>
    <td>{ props.dd.substr(0, 10).replace(/(\d+)-(\d+)-(\d+)/, '$3.$2.$1') }</td>
    <td>{ props.cd.substr(0, 10).replace(/(\d+)-(\d+)-(\d+)/, '$3.$2.$1') }</td>
    <td className="text-right" style={{ color: props.dt === 0 ? 'red' : 'green' }}>{ props.num }</td>
    <td className="text-right">{ props.s }</td>
    <td className="text-right">{ props.price.toFixed(2) }</td>
    {/* <td className="text-right">{ props.num !== 0 ? (props.qty/props.num).toFixed(2) : null }</td> */}
    <td className="text-right">{ props.qty.toFixed(2) }</td>
    <td className="text-right">{ props.commission.toFixed(2) }</td>
    <td className="text-right">{ props.tax.toFixed(2) }</td>
    <td>{ props.ppz }</td>
    <td>{ props.dt === 1 ? 'Приход' : 'Расход' }</td>
    <td>{ props.instr }</td>
    <td>{ props.node }</td>
    <td>{ props.number }</td>
  </tr>
)

const PiferDispatch = React.createContext(null);

export const Pifer = () => {
  const initialState = {
    rest: [], title: {}, ord: [], id: null, sid: null, showYield: false, Yield: null, Yielda: null, startDate: null, finishDate: null, graph: []
  }
  const reducer = (state, action) => {
    switch (action.type) {
      case 'rest_complete':
        return { ...state, showYield: false, ord: [], graph: [], rest: action.data }
      case 'pifer_select':
        return { ...state, title: action.data, id: action.data.id }
      case 'orders_complete':
        return { ...state, sid: action.sid, ord: action.data }
      case 'yield_complete':
        return { ...state, Yield: action.data.Yield, Yielda: action.data.Yielda, showYield: action.data.showYield }
      case 'fond_yield_complete':
        return { ...state, rest: state.rest.map( (item, index ) => ((item.id !== action.sid) ? item : { ...item, Yield: action.data.Yield, Yielda: action.data.Yielda, showYield: action.data.Success })) }
      case 'set_start_date':
        return { ...state, startDate: action.startDate }
        case 'set_finish_date':
          return { ...state, finishDate: action.finishDate }
        case 'graph_complete':
        return { ...state, graph: action.data }
      default:
        return state;
    }
  }
  const [{ rest, title, ord, id, sid, showYield, Yield, Yielda, startDate, finishDate, graph }, dispatch] = useReducer(reducer, initialState);
  useEffect(() => { document.title = 'Пайщики' })
  useEffect(() => {
    if (id) {
      const fetchData = async() => {
        const response = await fetch('api/RepWA/PostPiferRest', { 
          method: 'post', 
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ id: id, d1: startDate, d2: finishDate }), 
          credentials: 'include'
        })
        const result = await response.json();
        dispatch({ type: 'rest_complete', data: result });
      };
      fetchData();
    }
  }, [id, startDate, finishDate]);

  const onPiferSelect = async item => {
    dispatch({ type: 'pifer_select', data: item });
  }
  const onRestClick = async (id, sid) => {
    const response = await fetch('api/RepWA/PostPiferOrders', {
      method: 'post',
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: id, secId: sid }),
      credentials: 'include'
    })
    const result = await response.json();
    dispatch({ type: 'orders_complete', data: result, sid: sid });
  }
  const onShowYield = async id => {
    const response = await fetch(`api/RepWA/PostPiferYield`, { 
      method: 'post',
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, d1: startDate, d2: finishDate }),
      credentials: 'include' })
    const result = await response.json();
    dispatch({ type: 'yield_complete', data: { Yield: result.Yield, Yielda: result.Yielda, showYield: result.Success } });
  }
  const onShowFondYield = async (id, sid) => {
    const response = await fetch(`api/RepWA/PostPiferFondYield`, { 
      method: 'post',
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: id, secId: sid, d1: startDate, d2: finishDate }), 
      credentials: 'include' })
    const result = await response.json();
    dispatch({ type: 'fond_yield_complete', data: result, sid: sid });
  }
  const onShowGraph = async () => {
    const response = await fetch(`api/RepWA/PostPiferGraph3`, { 
      method: 'post',
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, d1: startDate, d2: finishDate }), 
      credentials: 'include' })
    const result = await response.json();
    dispatch({ type: 'graph_complete', data: result });
  }
  const onChangeS = async e => {
    dispatch({ type: 'set_start_date', startDate: e });
  }
  const onChangeF = async e => {
    dispatch({ type: 'set_finish_date', finishDate: e });
  }
  return (
    <div>
      <div className="mb-2">
        <div className="row no-gutters">
          <div className="col-md-auto">
            <div className="small">Начальная дата</div>
            <DatePicker
              showMonthDropdown
              showYearDropdown
              locale="ru"
              className="form-control form-control-sm"
              onChange={ e => onChangeS(e) }
              selected={ startDate }
              customInput={ <MaskedInput  mask={ "11.11.1111" }/> }
              dropdownMode="select"
              dateFormat="dd.MM.yyyy"
            />
          </div>
          <div className="col-md-auto no-gutters">
            <button className="btn btn-link btn-small" onClick={ () => dispatch({ type: 'set_start_date', startDate: new Date(new Date().getFullYear(), 0, 1) }) }><small>с начала года</small></button>
            <button className="btn btn-link btn-small" onClick={ () => dispatch({ type: 'set_start_date', startDate: new Date(new Date().setFullYear(new Date().getFullYear()-1)) }) }><small>1 год</small></button>
            <button className="btn btn-link btn-small" onClick={ () => dispatch({ type: 'set_start_date', startDate: new Date(new Date().setFullYear(new Date().getFullYear()-3)) }) }><small>3 года</small></button>
          </div>
          <div className="col-md-auto">
            <div className="small">Конечная дата</div>
            <DatePicker
              showMonthDropdown
              showYearDropdown
              locale="ru"
              className="form-control form-control-sm"
              onChange={ e => onChangeF(e) }
              selected={ finishDate }
              customInput={ <MaskedInput  mask={ "11.11.1111" }/> }
              dropdownMode="select"
              dateFormat="dd.MM.yyyy"
            />
          </div>
        </div> 
      </div>
      <Row>
        <Col sm={5}>
          <PiferAutocomplete onSelect={ onPiferSelect } />
        </Col>
      </Row>
      <PiferTitle { ...title } onShowYield={ onShowYield } showYield={ showYield } Yield={ Yield } Yielda={ Yielda } />
      <PiferRest id={ id } data={ rest } onRestClick={ onRestClick } onShowFondYield={ onShowFondYield } />
      {/* <ChartContainer  id={ this.state.id } /> */}
      <PiferOrd data={ ord } fond={ ord.length > 0 && rest.length > 0 ? (rest.filter(t => t.id === sid))[0].name : '' } />
      { title.brief ? <><a href='#' onClick={ e => { e.preventDefault(); onShowGraph() } } role="button">График</a> стоимости портфеля</> : null }
      { graph.length > 0 ? <LineGraph data={ graph }></LineGraph> : null }
      <Discl />
    </div>
  )
}
