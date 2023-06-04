import nprogress from "nprogress"
import { ElMessage } from 'element-plus'

//显示全屏 Loading
export function showFullLoading(){
    nprogress.start()
}


//隐藏全屏Loading
export function hideFullLoading(){
    nprogress.done()
}

/**
 * 消息提示框
 * @param message 要显示的信息内容
 * @param type 有以下四种:success warning error message
 */
export function showMessage(message, type){
    if(type === 'error'){
        ElMessage.error(message)
    }else{
        ElMessage(
            message,
            type
        )
    }
}
