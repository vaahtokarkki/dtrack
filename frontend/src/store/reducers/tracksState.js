import { ADD_TRACK, TOGGLE_TRACK, REMOVE_TRACK } from '../actiontypes'

const initialState = {
    tracks: [],
}

export default function(state = initialState, action) {
    switch (action.type) {
        case ADD_TRACK: {
            const notAffectedTracks = state.tracks.filter(track => track.id !== action.payload.id)
            const tracks = notAffectedTracks.concat([{ ...action.payload, displayOnMap: false }])
            return { ...state, tracks }
        }
        case REMOVE_TRACK : {
            const tracks = state.tracks.filter(track => track.id !== action.payload)
            return { ...state, tracks }
        }
        case TOGGLE_TRACK: {
            const trackToToggle = state.tracks.filter(track => track.id === action.payload)[0]
            const notAffectedTracks = state.tracks.filter(track => track.id !== action.payload)
            const tracks = notAffectedTracks.concat([{ ...trackToToggle, displayOnMap: !trackToToggle.displayOnMap }])
            return { ...state, tracks }
        }
        default:
            return state
    }
}
