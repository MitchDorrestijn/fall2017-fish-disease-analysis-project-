import React from 'react';
import { reactTranslateChangeLanguage } from 'translate-components'

const PickLanguage = () => {
	return (
		<div>
			<button onClick={reactTranslateChangeLanguage.bind(this, 'en')}>
				ENG
			</button>
			<button onClick={reactTranslateChangeLanguage.bind(this, 'nl')}>
				NLD
			</button>
			<button onClick={reactTranslateChangeLanguage.bind(this, 'de')}>
				GER
			</button>
			<button onClick={reactTranslateChangeLanguage.bind(this, 'fy')}>
				FRY
			</button>
			<button onClick={reactTranslateChangeLanguage.bind(this, 'es')}>
				SPA
			</button>
		</div>
	);
}

export default PickLanguage;
