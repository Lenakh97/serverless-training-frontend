import React, { Fragment } from 'react';
import Hero from './home/Hero.js';
import HomeContent from './home/HomeContent.js';

export default function Home() {
  return (
    <Fragment>
      <Hero />
      <div className="box cta">
        <p className="has-text-centered">
          <span className="tag is-primary">NEW</span> Upload your photographs to have objects recognised automatically!
        </p>
      </div>
      <HomeContent />
    </Fragment>
  );
}
