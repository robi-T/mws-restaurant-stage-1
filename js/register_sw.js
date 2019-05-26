    if (navigator.serviceWorker) {

        navigator.serviceWorker.register('./sw.js').then(function() {
            console.log('Registration of a service worker successful! Carry on...');
        }).catch(function() {
            console.log('Registration of a service worker failed!!');
        });
    }