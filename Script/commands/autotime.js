const _0x3e2f=["name","autotime","version","1.0.0","hasPermssion",0,"credits","MAHIM ISLAM","description","Automatic time-based messages","commandCategory","user","usages","[]","cooldowns",5,"Asia/Dhaka","format","h:mmA","message","♡︎⎯͢⎯⃝🩷 ","♡︎⎯͢"];
const moment=require("moment-timezone");
module.exports.config={
  [_0x3e2f[0]]:_0x3e2f[1],
  [_0x3e2f[2]]:_0x3e2f[3],
  [_0x3e2f[4]]:_0x3e2f[5],
  [_0x3e2f[6]]:_0x3e2f[7],
  [_0x3e2f[8]]:_0x3e2f[9],
  [_0x3e2f[10]]:_0x3e2f[11],
  [_0x3e2f[12]]:_0x3e2f[13],
  [_0x3e2f[14]]:_0x3e2f[15]
};
const nam=[
  {timer:"12:00AM",message:["⌚┆এখন রাত ১২টা বাজে\n❥︎খাউয়া দাউয়া করে নেউ😙"]},
  {timer:"1:00AM",message:["⌚┆এখন রাত ১টা বাজে\n❥︎সবাই শুয়ে পড়ো🤟"]},
  {timer:"2:00AM",message:["⌚┆এখন রাত ২টা বাজে\n❥︎প্রেম না কইরা যাইয়া ঘুমা বেক্কল😾"]},
  {timer:"3:00AM",message:["⌚┆এখন রাত ৩টা বাজে\n❥︎যারা ছ্যাকা খাইছে তারা জেগে আছে🫠"]},
  {timer:"4:00AM",message:["⌚┆এখন রাত ৪টা বাজে\n❥︎ফজরের প্রস্তুতি নাও"]},
  {timer:"5:00AM",message:["⌚┆এখন সকাল ৫টা বাজে\n❥︎নামাজ পড়ছো তো?❤️"]},
  {timer:"6:00AM",message:["⌚┆এখন সকাল ৬টা বাজে\n❥︎ঘুম থেকে উঠো সবাই"]},
  {timer:"7:00AM",message:["⌚┆এখন সকাল ৭টা বাজে\n❥︎ব্রেকফাস্ট করে নাও😊"]},
  {timer:"8:00AM",message:["⌚┆এখন সকাল ৮টা বাজে\n❥︎কাজ শুরু করো মন দিয়ে❤️"]},
  {timer:"9:00AM",message:["⌚┆এখন সকাল ৯টা বাজে\n❥︎চল কাজে মন দিই!"]},
  {timer:"10:00AM",message:["⌚┆এখন সকাল ১০টা বাজে\n❥︎তোমাদের মিস করছি"]},
  {timer:"11:00AM",message:["⌚┆এখন সকাল ১১টা বাজে\n❥︎কাজ চালিয়ে যাও!"]},
  {timer:"12:00PM",message:["⌚┆এখন দুপুর ১২টা বাজে\n❥︎ভালোবাসা জানাও সবাইকে❤️"]},
  {timer:"1:00PM",message:["⌚┆এখন দুপুর ১টা বাজে\n❥︎জোহরের নামাজ পড়ে নাও😻"]},
  {timer:"2:00PM",message:["⌚┆এখন দুপুর ২টা বাজে\n❥︎দুপুরের খাবার খেয়েছো তো?"]},
  {timer:"3:00PM",message:["⌚┆এখন বিকাল ৩টা বাজে\n❥︎কাজে ফোকাস করো"]},
  {timer:"4:00PM",message:["⌚┆এখন বিকাল ৪টা বাজে\n❥︎আসরের নামাজ পড়ে নাও🥀"]},
  {timer:"5:00PM",message:["⌚┆এখন বিকাল ৫টা বাজে\n❥︎একটু বিশ্রাম নাও"]},
  {timer:"6:00PM",message:["⌚┆এখন সন্ধ্যা ৬টা বাজে\n❥︎পরিবারকে সময় দাও😍"]},
  {timer:"7:00PM",message:["⌚┆এখন সন্ধ্যা ৭টা বাজে\n❥︎এশার নামাজ পড়ো❤️"]},
  {timer:"8:00PM",message:["⌚┆এখন রাত ৮টা বাজে\n❥︎আজকের কাজ শেষ করো"]},
  {timer:"9:00PM",message:["⌚┆এখন রাত ৯টা বাজে\n❥︎ঘুমের প্রস্তুতি নাও"]},
  {timer:"10:00PM",message:["⌚┆এখন রাত ১০টা বাজে\n❥︎ঘুমাতে যাও, স্বপ্নে দেখা হবে"]},
  {timer:"11:00PM",message:["⌚┆এখন রাত ১১টা বাজে\n❥︎ভালোবাসা রইলো 😴"]}
];
module.exports.onLoad=function({api}){
  setInterval(function(){
    const now=moment().tz(_0x3e2f[16])[_0x3e2f[17]](_0x3e2f[18]);
    const match=nam.find(entry=>entry.timer===now);
    if(match){
      const msg=match[_0x3e2f[19]][Math.floor(Math.random()*match[_0x3e2f[19]].length)];
      const styled=_0x3e2f[20]+msg+_0x3e2f[21];
      for(const threadID of global.data.allThreadID){
        api.sendMessage(styled,threadID);
      }
    }
  },60000);
};
module.exports.run=function(){};
