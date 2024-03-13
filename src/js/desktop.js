/*
 *Kintone に別のKintone 詳細表示
 * Copyright (c) 2024 noz-23
 *  https://github.com/noz-23/
 *
 * Licensed under the MIT License
 * 
 * History
 *  2024/03/10 0.1.0 初版とりあえずバージョン
 *  2024/03/12 0.1.1 表示の不具合修正
 */

jQuery.noConflict();

((PLUGIN_ID_)=>{
  'use strict';

  const IFRAME_DATA ='iframeData';	// 重複表示防止用のid名

  const EVENTS =[
    'app.record.detail.show', // 詳細表示
    'app.record.create.show', // 作成表示
    'app.record.edit.show',   // 編集表示
  ];
  kintone.events.on(EVENTS, async (events_) => {
    console.log('events_:%o',events_);

    // Kintone プラグイン 設定パラメータ
    const config = kintone.plugin.app.getConfig(PLUGIN_ID_);
    console.log("config:%o",config);
    // 
    const paramFieldLink=config['paramFieldLink'];
    const paramEditDetail=config['paramEditDetail'];
    const paramShowComment=config['paramShowComment'];
	
    // URL取得
    var linkUrl = events_.record[paramFieldLink].value;
    console.log("linkUrl:%o",linkUrl);

    // リンクの要らない部分の削除
    var linkPattern =/^https:\/\/([a-zA-Z0-9-+_]+).cybozu.(com|net)\/k\/[0-9]+\/show#record=[0-9]+/;
    var match = linkUrl.match(linkPattern);
    console.log("match:%o",match);
    if (!match) {
      return events_;
    }
        
    // "https://*.cybozu.com/k/742/show#record=1" 形式のURLが入る
    var iframeSrc =match[0];
    console.log("iframeSrc:%o",iframeSrc);
    
    // 重複表示防止
    var frame = document.getElementById(IFRAME_DATA);
    if( frame !=null || frame !=undefined)
    {
      // 詳細表示後、編集などすると同じものが増えるのでIDで重複表示防止
      frame.remove();
    }

    // <iframe></iframe>タグの作成
    // css 化する予定
    frame=document.createElement("iframe");
    frame.id =IFRAME_DATA;
    frame.src = iframeSrc;
    frame.width ='80%';
    frame.height ='100%';
    console.log("frame:%o",iframeSrc);

    // iframeの追加
    // スペースでの割り当ての場合、｢contentWindow.onload｣が処理しないため、document.bodyで一番下に追加
    document.body.appendChild(frame);
    
    // iframe 読み込み後の処理
    frame.contentWindow.onload = ()=>{
      //console.log("document :%o",document);

      var frame =document.getElementsByTagName("iframe")[0].contentWindow.document;
      //console.log("frame:%o",frame);

      // 家のマークと説明
      var menu =frame.getElementsByClassName('gaia-argoui-app-show-breadcrumb')[0];
      //console.log("menu:%o",menu);
      menu.style.display='none';
            
      // 右上の歯車のメニュー
      if(paramEditDetail =='false')
      {
        var editbar =frame.getElementsByClassName('gaia-argoui-app-toolbar-menu')[0];
        //console.log("editbar:%o",editbar);
        editbar.style.display='none';
      }
      // コメント
      if( paramShowComment=='false')
      {
        var commentbar =frame.getElementsByClassName('gaia-argoui-app-show-sidebar')[0];
        console.log("commentbar:%o",commentbar);
        commentbar.style.display='none';
      }
    };

    return events_;
  });
  
})(kintone.$PLUGIN_ID);
