// ==UserScript==
// @name         Koins Test Feature
// @namespace    https://dev.1024.info/
// @version      0.3
// @description  Hide successful and useless test in task.
// @author       Kasper
// @match        https://dev.1024.info/*/studio/task/*
// @grant        none
// @downloadURL  https://github.com/Kasp42/koins-test-feature/raw/master/koins-test-feature.user.js
// @updateURL    https://github.com/Kasp42/koins-test-feature/raw/master/koins-test-feature.user.js
// ==/UserScript==

(function() {
  'use strict';

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

    return i_good_first > i_good_second ? 1 : -1;
  }).sort(function(jq_first,jq_second)
  {
    console.log('1');
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
      if($(this).hasClass('test-status-delete') || $(this).find('td:eq(7) a').attr('title') === 'yes (50)' || $(this).find('td:eq(2)').text().trim() !== '[this]')
      {
        $(this).toggle();
      }
    });
  }
})();
