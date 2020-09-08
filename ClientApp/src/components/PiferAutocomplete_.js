import React from 'react'
import Autocomplete from 'react-autocomplete'
import PropTypes from 'prop-types'

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

PiferAutocomplete.propTypes = {
  completionInterval: PropTypes.number,
  minimumPrefixLength: PropTypes.number
}
PiferAutocomplete.defaultProps = {
  completionInterval: 1000,
  minimumPrefixLength: 3
}
