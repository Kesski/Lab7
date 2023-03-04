let url = 'https://api.wheretheiss.at/v1/satellites/25544'

let issLat = document.querySelector('#iss-lat')
let issLong = document.querySelector('#iss-long')
let timeIssLocatorFetched = document.querySelector('#time')


let update = 10000
let maxFailedAttempts = 3
let issMarker
let icon = L.icon({
    iconUrl: 'issIcon.png',
    iconSize: [50, 50],
    iconAnchor: [25, 25]
}) 

let map = L.map('iss-map').setView([0, 0], 1)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map)

iss(maxFailedAttempts) // call function one time to start
//setInterval(iss, 10000) // 10 seconds

function iss(attempts) {

    if(attempts <= 0) {
        alert('Failed to contact ISS server after several attempts.')
        return
    }

    fetch(url).then( (res) => {
        return res.json()
    }).then( (issData) => {
        console.log(issData)
        let lat = issData.latitude
        let long = issData.longitude
        issLat.innerHTML = lat
        issLong.innerHTML = long

        // create marker if it doesn't exist
        // move marker if it does exist
        if(!issMarker) {
            // create marker
            issMarker = L.marker([lat, long], {icon: icon}).addTo(map)
        } else {
            issMarker.setLatLng([lat, long])
        }

        let now = Date()
        timeIssLocatorFetched.innerHTML = `This data was fetched at ${now}`

    }).catch( (err) => {
        attempts-- // subtract 1 from number of attempts
        console.log('ERROR.', err)
    }).finally ( () => {
        setTimeout(iss, update, attempts)
    })
}