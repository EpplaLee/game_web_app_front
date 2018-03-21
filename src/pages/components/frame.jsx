import React from 'react';
import Header from './header';
import Navigation from './navigation';
import './frame.css'

export default function Frame ({ child, header_title }) {
  //const { header_title, child } = this.props
  return <div className="frame">
  <Header header_title={header_title} />
  <div style={{ height: '82%' }}>
    {child}
  </div>
  <Navigation />
</div>
}