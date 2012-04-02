function saveSelection(containerEl) {
    var charIndex = 0, start = 0, end = 0, foundStart = false, stop = {};
    var sel = rangy.getSelection(), range;

    function traverseTextNodes(node, range) {
        if (node.nodeType == 3) {
            if (!foundStart && node == range.startContainer) {
                start = charIndex + range.startOffset;
                foundStart = true;
            }
            if (foundStart && node == range.endContainer) {
                end = charIndex + range.endOffset;
                throw stop;
            }
            charIndex += node.length;
        } else {
            for (var i = 0, len = node.childNodes.length; i < len; ++i) {
                traverseTextNodes(node.childNodes[i], range);
            }
        }
    }
    
    if (sel.rangeCount) {
        try {
            traverseTextNodes(containerEl, sel.getRangeAt(0));
        } catch (ex) {
            if (ex != stop) {
                throw ex;
            }
        }
    }

    return {
        start: start,
        end: end
    };
}

function restoreSelection(containerEl, savedSel) {
    var charIndex = 0, range = rangy.createRange(), foundStart = false, stop = {};
    range.collapseToPoint(containerEl, 0);
    
    function traverseTextNodes(node) {
        if (node.nodeType == 3) {
            var nextCharIndex = charIndex + node.length;
            if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                range.setStart(node, savedSel.start - charIndex);
                foundStart = true;
            }
            if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
                range.setEnd(node, savedSel.end - charIndex);
                throw stop;
            }
            charIndex = nextCharIndex;
        } else {
            for (var i = 0, len = node.childNodes.length; i < len; ++i) {
                traverseTextNodes(node.childNodes[i]);
            }
        }
    }
    
    try {
        traverseTextNodes(containerEl);
    } catch (ex) {
        if (ex == stop) {
            rangy.getSelection().setSingleRange(range);
        } else {
            throw ex;
        }
    }
}


$(function() {
	$.fn.writemaths = function(options) {
		options = $.extend({
			cleanMaths: function(m){ return m; },
			callback: function() {}
		},options);

        $(this).each(function() {

            var el = $(this);
            el
                .addClass('writemaths tex2jax_ignore')
                .attr('contenteditable','true')
            ;
            el.parent().append('<div class="preview"/>');

            var queue = MathJax.Callback.Queue(MathJax.Hub.Register.StartupHook("End",{}));
            el.on('keyup click',function(e) {

                var previewElement = el.parent().find('.preview');
                previewElement.hide();

                var sel = rangy.getSelection();
                try{
                    var pos = sel.getStartDocumentPos();
                }
                catch(e) {
                    return;
                }
                var anchor = sel.anchorNode;
                var range = sel.getRangeAt(0);

                //only do this if the selection has zero width
                //so when you're selecting blocks of text, distracting previews don't pop up
                if(range.startOffset != range.endOffset)
                    return;

                //get the text in th
                var txt = $(anchor).text();

                var i=0;
                var inMath=false;
                var startMath = 0;
                var mathLimit,mathDelimit;
                var otxt = txt;
                while(i<range.startOffset)
                {
                    if(inMath)
                    {
                        if(txt.slice(i,i+mathDelimit.length)==mathDelimit)
                        {
                            inMath = false;
                            i+=mathDelimit.length-1;

                            var ol = txt.length;
                            /*if(i<txt.length-1 && !$(anchor).parents('.wm_maths').length) {
                                txt = 
                                    txt.slice(0,startMath-mathLimit.length) +
                                    '<span class="wm_maths">' +
                                    txt.slice(startMath-mathLimit.length,i+mathDelimit.length) +
                                    '</span><span> </span>' +
                                    txt.slice(i+mathDelimit.length);
                                i+=txt.length-ol.length;
                            }*/
                        }
                    }
                    else if(txt[i]=='$')
                    {
                        inMath = true;
                        startMath = i+1;
                        mathLimit = '$';
                        mathDelimit = '$';
                    }
                    else if(txt.slice(i,i+2)=='\\[')
                    {
                        inMath = true;
                        startMath = i+2;
                        mathLimit = '\\[';
                        mathDelimit = '\\]';
                    }
                    i+=1;
                }
                if(txt!=otxt) {
                    //sel = saveSelection(el[0]);
                    anchor = $(anchor).replaceWith(txt);
                    //restoreSelection(el[0],sel);
                }

                if(!inMath)
                {
                    previewElement.hide();
                    return;
                }

                i = startMath+1;
                while(i<txt.length && inMath)
                {
                    if(txt.slice(i,i+mathDelimit.length)==mathDelimit)
                        inMath = false;
                    i+=1;
                }

                if(inMath && i==txt.length)
                {
                    //try to make a guess at how much of the remaining string is meant to be maths
                    var words = txt.slice(startMath).split(' ');
                    var j = 0;
                    while(j<words.length && !words[j].match(/^([a-zA-Z]{2,})?$/))
                    {
                        j+=1;
                    }
                    i = startMath + words.slice(0,j).join(' ').length;
                    i = Math.max(range.startOffset,i)+1;
                }

                var math = txt.slice(startMath,i-1);


                if(!math.length)
                    return;

                math = mathLimit + math + mathDelimit;

                function positionPreview() {
                    previewElement.position({my: 'left bottom', at: 'left top', of: document, offset: pos.x+' '+pos.y, collision: 'fit'})
                }

                previewElement
                    .show()
                    .html(options.cleanMaths(math))
                ;
                positionPreview();

                queue.Push(['Typeset',MathJax.Hub,previewElement[0]]);
                queue.Push(positionPreview);
                queue.Push(options.callback);
            });

        });
		return this;
	}

	$('#wm').writemaths();
});
