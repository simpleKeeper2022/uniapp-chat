
// 聊天消息格式  msgSender 0 - 客户  1 -  客服
export interface ChatMsg {
  text: string,
  avatarImg: string,
  mediaUrl?: string,
  time?: string,
  msgType?: number,
  msgSender: number
}
// 弹幕消息格式
export interface DanmuItem {
  text: string,
  color: string,
  time: number
}