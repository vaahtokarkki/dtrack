import { ADD_TRACK } from '../actiontypes'

const initialState = {
    tracks: [],
}

export default function(state = initialState, action) {
    switch (action.type) {
        case ADD_TRACK: {
            const notAffectedTracks = state.tracks.filter(track => track.id !== action.payload.id)
            const tracks = notAffectedTracks.concat([action.payload])
            return { ...state, tracks }
        }
        default:
            return state
    }
}
