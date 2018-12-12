
// //Registering the Service Worker

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('sw.js').then(registration => {

		}).catch(error => {

		});
	});
}

const dbPromise = idb.open('currency-rates', 1, upgradeDB => {
	switch (upgradeDB.oldVersion) {
		case 0:
			upgradeDB.createObjectStore('objs', { keyPath: 'id' });
	}
});

fetch("https://free.currencyconverterapi.com/api/v5/currencies")
	.then(response => response.json())
	.then(data => {

		for (const key in data) {
			return data[key];
		}
	})
	.then(datakey => {
		for (const key2 in datakey) {
			const id = datakey[key2].id;
			const CURRENCY_NAME = datakey[key2].currencyName;
			$('#homeCurrency, #travelCurrency').append($('<option>').text(`${CURRENCY_NAME}  ${id}`).attr('value', id));
		}
	})
	.catch((error) => {

	})



const convertCurrency = (isRateFound) => {

	const homeCurrency = document.getElementById("homeCurrency").value;
	const travelCurrency = document.getElementById("travelCurrency").value;
	const query = `${homeCurrency}_${travelCurrency}`;


	fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra`)
		.then(response => {
			return response.json();
		})
		.then(data => {
			dbPromise.then(db => {
				if (!db) return;
				const tx = db.transaction('objs', 'readwrite');
				const store = tx.objectStore('objs');

				store.put({ id: query, rates: data });
				return tx.complete;
			})


			const oneUnit = data[query];
			const amt = document.getElementById("homeValue").value;
			document.getElementById("travelValue").value = `${travelCurrency} ${(oneUnit * amt).toFixed(2)}`;

		})
		.catch(() => {
			if (!isRateFound) {
				alert('Cannot convert this while offline');
			}

		});


}
