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
      segment.querySelector('.toggle-effort-visibility').click()
      shouldRefreshAchievements = true
    }
  })

  document.querySelectorAll('.hidden-segments .full-columns').forEach(segment => {
    const name = segment.querySelector('.name').innerText
    if (name.toLowerCase().indexOf('(zwift insider verified)') !== -1) {
      console.log('Unhiding', name)
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
