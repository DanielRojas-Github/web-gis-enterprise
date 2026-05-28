export const IdentifyTool = {
  id: 'identify',

  activate() {
    console.log('Identify enabled')
  },

  deactivate() {
    console.log('Identify disabled')
  },

  onMapClick(event) {
    console.log('Identify click:', event.latlng)
  },
}