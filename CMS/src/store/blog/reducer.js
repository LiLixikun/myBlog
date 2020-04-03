import { BLOG_VISIBLE, BLOG_ADD, BLOG_DEL } from './constants'

const initState = {
    visible: false,
    dataList: [1, 2]
}
export default (state = initState, action) => {
    switch (action.type) {
        case BLOG_VISIBLE:
            return { ...state, ...action.data }
        case BLOG_ADD:

            break;
        case BLOG_DEL:
            break;
        default:
            return state
    }
}