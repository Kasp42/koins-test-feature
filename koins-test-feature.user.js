// ==UserScript==
// @name         Koins Test Feature
// @namespace    https://dev.1024.info/
// @version      0.4
// @description  Hide successful and useless test in task.
// @author       Kasper
// @match        https://dev.1024.info/*/studio/task/*
// @match        https://dev.1024.info/*/studio/test-event.html*
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL  https://github.com/Kasp42/koins-test-feature/raw/master/koins-test-feature.user.js
// @updateURL    https://github.com/Kasp42/koins-test-feature/raw/master/koins-test-feature.user.js
// ==/UserScript==

let URL_LOCAL_TRUNK = GM_getValue('URL_LOCAL_TRUNK','');
let URL_LOCAL_STABLE = GM_getValue('URL_LOCAL_STABLE','');
let URL_LOCAL_STUDIO = GM_getValue('URL_LOCAL_STUDIO','');


(function() {
  'use strict';

  if(!URL_LOCAL_TRUNK)
    GM_setValue('URL_LOCAL_TRUNK','wl.tr')
  if(!URL_LOCAL_STABLE)
    GM_setValue('URL_LOCAL_STABLE','wl.st')
  if(!URL_LOCAL_STUDIO)
    GM_setValue('URL_LOCAL_STUDIO','studio.tr')

  function buttonRunHtml(host_base,s_test)
  {
    var url_action = 'http://'+host_base+'/en-prg/prg/test-start.html';

    var html_button = '<td class="image valign-top"><form action="'+url_action+'" target="_blanc" method="get">'
    html_button += '<input name="s_filter_auto_start" type="hidden" value="'+s_test+'">';
    //html_button += '<input name="is_search" type="hidden" value="1">';
    //html_button += '<input name="prg-test-start" type="hidden" value="0000000000">';
    html_button += '<input title="Run test on '+host_base+'" type="submit" value="" style="';
    html_button += '  background: url(https://d1zn50cvpmsdm6.cloudfront.net/0/9.png);';
    html_button += '  border: none;';
    html_button += '  width: 16px;';
    html_button += '  height: 16px;';
    html_button += '">';
    html_button += '</form></td>';

    return html_button;
  }

  var jq_view_test = $('#studio-task-view-test tr.head').append('<td style="width:19px;">&nbsp;</td>');
  $('#studio-task-view-test tr.data').each(function()
  {
    var s_test = $(this).find('.log-switch').text();

    if(s_test && !$(this).hasClass('test-status-delete'))
    {
      s_test = s_test.replace(' >>><<<','').replace(/([a-z]+)\//,'');

      var s_instance = $(this).closest('tr').find('[data-info]').data('info');
      var url_base = '';
      if(s_instance === 'wl.test' && URL_LOCAL_TRUNK)
        url_base = URL_LOCAL_TRUNK;
      else if(s_instance === 'wl.stable.test' && URL_LOCAL_STABLE)
        url_base = URL_LOCAL_STABLE;
      else if(s_instance === 'studio.test' && URL_LOCAL_STUDIO)
        url_base = URL_LOCAL_STUDIO;

      if(url_base)
      {
        $(this).append(buttonRunHtml(url_base,s_test));
        return;
      }
    }

    $(this).append('<td></td>');
  });

  $('#studio-task-view-test .data').each(function(){
    if($(this).hasClass('test-status-error'))
    {
      $(this).data('priority',1);
    }else if($(this).hasClass('test-status-warning'))
    {
      $(this).data('priority',2);
    }else if($(this).hasClass('test-status-doc'))
    {
      $(this).data('priority',3);
    }else if($(this).hasClass('test-status-note'))
    {
      $(this).data('priority',4);
    }else
    {
      $(this).data('priority',5);
    }
  });

  $('#studio-task-view-test .data').detach().sort(function(jq_first,jq_second)
  {
    var a_match_first = $(jq_first).find('td:eq(7) a').attr('title').match(/\((\d+)\)/);
    var a_match_second = $(jq_second).find('td:eq(7) a').attr('title').match(/\((\d+)\)/);
    if(a_match_first === null || a_match_second === null)
      return 1;
    var i_good_first = parseInt(a_match_first[1]);
    var i_good_second = parseInt(a_match_second[1]);
    if(i_good_first === i_good_second)
      return 0;

    return i_good_first < i_good_second ? 1 : -1;
  }).sort(function(jq_first,jq_second)
  {
    return $(jq_first).data('priority') > $(jq_second).data('priority') ? 1 : -1;
  }).appendTo('#studio-task-view-test');

  $('#studio-task-view-test tr.head').on('click',function()
  {
    toggleTest();
  });

  toggleTest();

  function toggleTest()
  {
    $('#studio-task-view-test tr.data').each(function()
    {
      var text_log = $(this).find('td:eq(8)').text();
      console.log(text_log.indexOf('Error communicating with the remote browser. It may have died.'));
      if(
        $(this).hasClass('test-status-delete') ||
        $(this).find('td:eq(7) a').attr('title') === 'yes (50)' ||
        $(this).find('td:eq(2)').text().trim() !== '[this]' ||
        text_log.indexOf('Error communicating with the remote browser. It may have died.') >= 0
      )
      {
        $(this).toggle();
      }
    });
  }
})();
