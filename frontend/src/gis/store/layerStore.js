import { create } from "zustand";

const initialLayers = [
  {
    id: "basemaps",
    name: "Base Maps",
    type: "group",
    visible: true,

    children: [
      {
        id: "osm",
        name: "OpenStreetMap",
        type: "tile",

        visible: true,
        opacity: 1,
        zIndex: 1,

        legendUrl: "",
        permissions: []
      }
    ]
  },

  {
    id: "environment",
    name: "Environment",
    type: "group",
    visible: true,

    children: [
      {
        id: "rivers",
        name: "Rivers",
        type: "wms",

        visible: true,
        opacity: 1,
        zIndex: 2,

        legendUrl: "",
        permissions: []
      }
    ]
  }
];

export const useLayerStore = create((set) => ({
  layers: initialLayers,

  activeLayer: null,

  addLayer: (groupId, layer) =>
    set((state) => ({
      layers: state.layers.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            children: [...group.children, layer]
          };
        }

        return group;
      })
    })),

  removeLayer: (layerId) =>
    set((state) => ({
      layers: state.layers.map((group) => ({
        ...group,

        children: group.children.filter(
          (layer) => layer.id !== layerId
        )
      }))
    })),

  toggleLayer: (layerId) =>
    set((state) => ({
      layers: state.layers.map((group) => ({
        ...group,

        children: group.children.map((layer) => {
          if (layer.id === layerId) {
            return {
              ...layer,
              visible: !layer.visible
            };
          }

          return layer;
        })
      }))
    })),

  toggleGroup: (groupId) =>
    set((state) => ({
      layers: state.layers.map((group) => {
        if (group.id === groupId) {
          const newVisibility = !group.visible;

          return {
            ...group,
            visible: newVisibility,

            children: group.children.map((layer) => ({
              ...layer,
              visible: newVisibility
            }))
          };
        }

        return group;
      })
    })),

  updateOpacity: (layerId, opacity) =>
    set((state) => ({
      layers: state.layers.map((group) => ({
        ...group,

        children: group.children.map((layer) => {
          if (layer.id === layerId) {
            return {
              ...layer,
              opacity
            };
          }

          return layer;
        })
      }))
    })),

  setActiveLayer: (layer) =>
    set({
      activeLayer: layer
    })
}));