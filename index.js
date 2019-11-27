function isZwiftActivity() {
  const deviceEl = document.querySelector('.device')
  const titleEl = document.querySelector('.title')
  const segmentsEl = document.querySelector('#segments')

  const zwiftDevice = () => deviceEl && deviceEl.innerText === 'Zwift'
  const virtual = () => titleEl && titleEl.innerText.indexOf('Virtual Ride') !== -1
  const zwiftInsiderSegments = () => segmentsEl && segmentsEl.innerText.toLowerCase().indexOf('(zwift insider verified)') !== -1

  return zwiftDevice() || (virtual() && zwiftInsiderSegments())
}

function showZwiftInsiderSegmentsOnly() {
  let shouldRefreshAchievements = false

  document.querySelectorAll('.segments .full-columns').forEach(segment => {
    const name = segment.querySelector('.name').innerText
    if (name.toLowerCase().indexOf('(zwift insider verified)') === -1) {
      console.log('Hiding', name)
      displayMessage()
      segment.querySelector('.toggle-effort-visibility').click()
      shouldRefreshAchievements = true
    }
  })

  document.querySelectorAll('.hidden-segments .full-columns').forEach(segment => {
    const name = segment.querySelector('.name').innerText
    if (name.toLowerCase().indexOf('(zwift insider verified)') !== -1) {
      console.log('Unhiding', name)
      displayMessage()
      segment.querySelector('.toggle-effort-visibility').click()
      shouldRefreshAchievements = true
    }
  })

  if (shouldRefreshAchievements) {
    console.log('Refreshing achievements!')
    document.querySelector('.sidenav #refresh-achievements').click()
    document.querySelector('.super-tooltip .button').click()
  } else {
    console.log('No changes necessary!')
  }
}

function displayMessage() {
  document.body.insertAdjacentHTML('beforeend', `
    <div style="z-index: 9999; display: flex; position: fixed; top: 0; bottom: 0; left: 0; right: 0; background: #3e5062; color: white; font-size: 30px; justify-content: center; align-items: center;">
      Loading&nbsp;<span style="font-weight: 600; color: #ff6900;">ZWIFT</span><span style="font-weight: 600; color: rgba(255,255,255,.6);">INSIDER</span>&nbsp;verified segments...
    </div>
  `)
}

(()=> {
  if (isZwiftActivity()) showZwiftInsiderSegmentsOnly()
})()

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "clicked_browser_action" && confirm('Are you sure you want run Zwift Insider Segments?')) {
      showZwiftInsiderSegmentsOnly()
    }
  }
)
