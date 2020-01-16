(() => {
    let defaultSource = 'USD';
    const sourceSelector = document.querySelector('#sources');
    const result = document.querySelector('main');
    const baseURL = 'https://api.exchangeratesapi.io';
    
    const choices = new Choices(sourceSelector);

    if( 'serviceWorker' in navigator ) {
        window.addEventListener('load', () =>
            navigator.serviceWorker.register('sw.js')
                .then(registration => console.log('Service worker registered.'))
                .catch( err => 'SW registration failed')
        );
    }

    window.addEventListener('load', e => {
        updateCurrency(defaultSource);
        sourceSelector.addEventListener('change', evt => updateSource(evt.target.value));
    });

    window.addEventListener('online', () => updateCurrency(sourceSelector.value));

    async function updateSource ( source = defaultSource ) {
        defaultSource = source;
        updateCurrency( defaultSource );
    }

    async function updateCurrency( source = defaultSource ) {
        result.innerHTML = '';
        const response = await fetch(`${baseURL}/latest?base=${defaultSource}`);
        const json = await response.json();
        result.innerHTML = createList(json.rates);
    }

    function createList(rates) {
        let html = "<table class='table table-hover table-stripped'><thead><tr><th>Currency</th><th>Rates</th></tr></thead><tbody>";
        Object.keys(rates).forEach( (keys,index) => {
            html += `<tr><td>${keys}</td><td>${rates[keys]}</td></tr>`
        });
        html += "</tbody></table>";

        return html;
    }

})();