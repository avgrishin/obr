import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import { Col, Row } from 'reactstrap'
import Autocomplete from 'react-autocomplete'
// import { Line } from 'react-chartjs-2'
import DatePicker, { registerLocale } from "react-datepicker";
import MaskedInput from 'react-maskedinput';
import ru from 'date-fns/locale/ru';
import "react-datepicker/dist/react-datepicker.css";
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
      <tr><th>Фонд</th><th>Дата заявки</th><th>Дата расчета</th><th className="text-right">Кол-во</th><th className="text-right">Остаток</th><th className="text-right">Цена</th><th className="text-right">Стоимость</th><th className="text-right">Комиссия</th><th className="text-right">Налог</th><th>ППЗ</th><th>Тип</th><th>Операция</th><th>Состояние</th><th>Номер</th></tr>
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
    <td className="text-right">{ props.num !== 0 ? (props.qty/props.num).toFixed(2) : null }</td>
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

const PiferAutocomplete1 = props => {
  const { completionInterval } = props;
  const [value, setValue] = useState('');
  const [pifers, setPifers] = useState([]);
  const [currentPrefix, setCurrentPrefix] = useState('');
  const [cache, setCache] = useState([]);
  const [loading, setLoading] = useState(false);
  let _completeTimer;

  useEffect(() => {
    _completeTimer = null
    return () => {
      clearTimeout(_completeTimer)
      _completeTimer = null
    }
  });
  const onChange = (event, value) => {
    clearTimeout(_completeTimer)
    setValue(value)
    _completeTimer = setTimeout(() => {
      clearTimeout(_completeTimer)
      let text = value
      if (currentPrefix !== text) {
        if (text.length < props.minimumPrefixLength) {
          setPifers([]);
          setCurrentPrefix(text);
        }
        else {
          if (cache && cache[text]) {
            setPifers(cache[text]);
            setCurrentPrefix(text);
          }
          else {
            setLoading(true);
            fetch('api/RepWA/PostPifers', { 
              method: 'post', 
              headers: { "content-type": "application/json" },
              body: JSON.stringify(text),
              credentials: 'include' })
            .then(response => response.json())
            .then(data => {
              let _cache = {...cache}
              _cache[text] = data;
              setLoading(false);
              setCache(_cache);
              setPifers(data);
              setCurrentPrefix(text);
            })
          }
        }
      }
    }, completionInterval)
  }
  const onTimerTick = () => {
    clearTimeout(_completeTimer)
    let text = value
    if (currentPrefix !== text) {
      if (text.length < props.minimumPrefixLength) {
        setPifers([]);
        setCurrentPrefix(text);
      }
      else {
        if (cache && cache[text]) {
          setPifers(cache[text]);
          setCurrentPrefix(text);
        }
        else {
          setLoading(true);
          fetch('api/RepWA/PostPifers', { 
            method: 'post', 
            headers: { "content-type": "application/json" },
            body: JSON.stringify(text),
            credentials: 'include' })
          .then(response => response.json())
          .then(data => {
            let _cache = {...cache}
            _cache[text] = data;
            setLoading(false);
            setCache(_cache);
            setPifers(data);
            setCurrentPrefix(text);
          })
        }
      }
    }
  }
  const onSelect = (_value, item) => {
    setValue(_value);
    setPifers([item]);
    setCurrentPrefix(_value);
    props.onSelect(item)
  }
  const renderMenu = (items, value) => (
    <ul className="menu">
      { currentPrefix.trim().length < props.minimumPrefixLength ? (
      <li className="item">Введите код пайщика</li>
      ) : items.length === 0 ? (
      <li className="item">Не найдено "{value}"</li>
      ) : '' }
      { items }
    </ul>
  )
  const renderItem = (item, isHighlighted) => (
    <li className={`item ${isHighlighted ? 'item-highlighted' : ''}`} key={ item.id }>
      <div>{item.brief}</div><div><small>{ `${item.fam} ${item.im} ${item.ot}` }</small></div>
    </li>
  )
  return (
    <Autocomplete
      inputProps={{ id: 'states-autocomplete', className: `form-control${ loading ? ' ac_loading' : ''}` }}
      wrapperStyle={{ position: 'relative', marginBottom: '15px' }}
      getItemValue={ item => item.brief }
      items={ pifers }
      renderMenu={ renderMenu }
      renderItem={ renderItem }
      value={ value }
      onChange={ onChange }
      onSelect={ onSelect }
      autoHighlight={ false }
    />
  )
}

class PiferAutocomplete extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      pifers: [], 
      currentPrefix: '',
      cache: [],
      loading: false
    }
  }
  componentDidMount() {
    this._completeTimer = null
  }
  componentWillUnmount() {
    clearTimeout(this._completeTimer)
    this._completeTimer = null
  }
  onChange = (event, value) => {
    clearTimeout(this._completeTimer)
    this.setState({ value })

    if (this.state.currentPrefix !== value) {
      if (value.length < this.props.minimumPrefixLength) {
        this.setState({ pifers: [], currentPrefix: value })
      }
      else {
        if (this.state.cache && this.state.cache[value]) {
          this.setState({ pifers: this.state.cache[value], currentPrefix: value })
        }
        else {
          this._completeTimer = setTimeout(this.onTimerTick, this.props.completionInterval)
        }
      }
    }
  }

  onTimerTick = () => {
    clearTimeout(this._completeTimer)
    let text = this.state.value
    // if (this.state.currentPrefix !== text) {
    //   if (text.length < this.props.minimumPrefixLength) {
    //     this.setState({ pifers: [], currentPrefix: text })
    //   }
    //   else {
    //     if (this.state.cache && this.state.cache[text]) {
    //       this.setState({ pifers: this.state.cache[text], currentPrefix: text })
    //     }
    //     else {
          this.setState({ loading: true })
          fetch('api/RepWA/PostPifers', { 
            method: 'post', 
            headers: { "content-type": "application/json" },
            body: JSON.stringify(text),
            credentials: 'include' })
          .then(response => response.json())
          .then(data => {
            let cache = {...this.state.cache}
            cache[text] = data
            this.setState({ loading: false, cache, pifers: data, currentPrefix: text })
          })
    //     }
    //   }
    // }
  }
  onSelect = (value, item) => {
    this.setState({ value, pifers: [item], currentPrefix: value })
    this.props.onSelect(item)
  }
  renderMenu = (items, value) => (
    <ul className="menu">
      { this.state.currentPrefix.trim().length < this.props.minimumPrefixLength ? (
      <li className="item">Введите код пайщика</li>
      ) : items.length === 0 ? (
      <li className="item">Не найдено "{value}"</li>
      ) : '' }
      { items }
    </ul>
  )
  renderItem = (item, isHighlighted) => (
    <li className={`item ${isHighlighted ? 'item-highlighted' : ''}`} key={ item.id }>
      <div>{item.brief}</div><div><small>{ `${item.fam} ${item.im} ${item.ot}` }</small></div>
    </li>
  )
  render = () => (
    <Autocomplete
      inputProps={{ id: 'states-autocomplete', className: `form-control form-control-sm${this.state.loading ? ' ac_loading' : ''}` }}
      wrapperStyle={{ position: 'relative', marginBottom: '5px' }}
      getItemValue={ item => item.brief }
      items={ this.state.pifers }
      renderMenu={ this.renderMenu }
      renderItem={ this.renderItem }
      value={ this.state.value }
      onChange={ this.onChange }
      onSelect={ this.onSelect }
      autoHighlight={ false }
    />
  )
}

export const Pifer = () => {
  const [rest, setRest] = useState([]);
  const [title, setTitle] = useState({});
  const [ord, setOrd] = useState([]);
  const [id, setId] = useState(null);
  const [sid, setSid] = useState(null);
  const [showYield, setShowYield] = useState(false);
  const [Yield, setYield] = useState(null);
  const [Yielda, setYielda] = useState(null);
  const [startDate, setStartDate] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchData = async() => {
        const response = await fetch('api/RepWA/PostPiferRest', { 
          method: 'post', 
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ id: id, d: startDate }), 
          credentials: 'include'
        })
        const result = await response.json();
        setShowYield(false);
        setOrd([]);
        setRest(result);
      };
      fetchData();
    }
  }, [id, startDate]);

  const onPiferSelect = async item => {
    setTitle(item);
    setId(item.id);
  }
  const onRestClick = async (id, sid) => {
    const response = await fetch('api/RepWA/PostPiferOrders', {
      method: 'post',
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: id, secId: sid }),
      credentials: 'include'
    })
    const result = await response.json();
    setSid(sid);
    setOrd(result);
  }
  const onShowYield = async id => {
    const response = await fetch(`api/RepWA/PostPiferYield`, { 
      method: 'post',
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, d: startDate }),
      credentials: 'include' })
    const result = await response.json();
    setYield(result.Yield);
    setYielda(result.Yielda);
    setShowYield(result.Success);
  }
  const onShowFondYield = async (id, sid) => {
    const response = await fetch(`api/RepWA/PostPiferFondYield`, { 
      method: 'post',
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: id, secId: sid, d: startDate }), 
      credentials: 'include' })
    const result = await response.json();
    setRest(rest.map( (item, index ) => ((item.id !== sid) ? item : { ...item, Yield: result.Yield, Yielda: result.Yielda, showYield: result.Success })));
  }
  const onChange = async e => {
    console.log(e)
    setStartDate(e);
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
              onChange={ e => onChange(e) }
              selected={ startDate }
              customInput={ <MaskedInput  mask={ "11.11.1111" }/> }
              dropdownMode="select"
              dateFormat="dd.MM.yyyy"
            />
          </div>
          <div className="col-md-auto no-gutters">
          <button className="btn btn-link btn-small" onClick={ () => setStartDate(new Date(new Date().getFullYear(), 0, 1)) }><small>с начала года</small></button>
          <button className="btn btn-link btn-small" onClick={ () => setStartDate(new Date(new Date().setFullYear(new Date().getFullYear()-1))) }><small>1 год</small></button>
          <button className="btn btn-link btn-small" onClick={ () => setStartDate(new Date(new Date().setFullYear(new Date().getFullYear()-3))) }><small>3 года</small></button>
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
      {/* <Line data={ data } options={ options } width="600" height="250" /> */}
    </div>
  )
}

PiferAutocomplete.propTypes = {
  completionInterval: PropTypes.number,
  minimumPrefixLength: PropTypes.number
}
PiferAutocomplete.defaultProps = {
  completionInterval: 1000,
  minimumPrefixLength: 3
}
