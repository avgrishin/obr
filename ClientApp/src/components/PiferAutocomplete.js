import React, { useState, useEffect, useRef } from 'react'
import Autocomplete from 'react-autocomplete'
import PropTypes from 'prop-types'

const useAutocomplete = props => {
  const [data, setData] = useState([]);
  const [currentPrefix, setCurrentPrefix] = useState('');
  const [cache, setCache] = useState([]);
  const [oldPrefix, setOldPrefix] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async() => {
      setLoading(true);
      const response = await fetch('api/RepWA/PostPifers', { 
        method: 'post',
        headers: { "content-type": "application/json" },
        body: JSON.stringify(currentPrefix),
        credentials: 'include' });
      const result = await response.json();
      setCache(c=> ({...c, [currentPrefix]: result }));
      setData(result);
      setOldPrefix(currentPrefix)
      setLoading(false);
    };
    if (currentPrefix.length >= props.minimumPrefixLength) {
      fetchData();
    }
  }, [currentPrefix]);
  return [{ data, cache, oldPrefix, loading }, setCurrentPrefix];
}

const PiferAutocomplete = props => {
  const [{ data, cache, oldPrefix, loading }, setAutocomplete] = useAutocomplete({minimumPrefixLength: props.minimumPrefixLength} )
  const [value, setValue] = useState('');
  const [pifers, setPifers] = useState([]);
  useEffect(() => setPifers(data), [data]);
  const _completeTimer = useRef();

  const onChange = (e) => {
    clearTimeout(_completeTimer.current)
    setValue(e.target.value)
    if (e.target.value.length < props.minimumPrefixLength) {
      setPifers([]);
    }
    else {
      if (cache && cache[e.target.value]) {
        setPifers(cache[e.target.value]);
      }
      else {
        const pendingCurrentPrefix = e.target.value;
        _completeTimer.current = setTimeout(() => {
          setAutocomplete(pendingCurrentPrefix);      
        }, props.completionInterval);
      }
    }
  }
  const onSelect = (_value, item) => {
    setValue(_value);
    setPifers([item]);
    props.onSelect(item)
  }
  const renderMenu = (items, val) => (
    <ul className="menu">
    { oldPrefix.trim().length < props.minimumPrefixLength ? (
    <li className="item">Введите код пайщика</li>
    ) : items.length === 0 ? (
    <li className="item">Не найдено "{val}"</li>
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
      inputProps={{ id: 'states-autocomplete', className: `form-control form-control-sm${ loading ? ' ac_loading' : ''}` }}
      wrapperStyle={{ position: 'relative', marginBottom: '5px' }}
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

PiferAutocomplete.propTypes = {
  completionInterval: PropTypes.number,
  minimumPrefixLength: PropTypes.number
}
PiferAutocomplete.defaultProps = {
  completionInterval: 1000,
  minimumPrefixLength: 3
}
export default PiferAutocomplete;