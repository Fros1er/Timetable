(function (global) {
  var Timetables = function (option) {
    this.el = document.querySelector(option.el);
    this.Timetables = option.timetables || [];
    this.week = option.week || [];
    this.merge = typeof option.merge === 'boolean' ? option.merge : true;
    this.TimetableType = option.timetableType || [];
    this.leftHandText = [];
    this.highlightWeek = option.highlightWeek || '';
    this.gridOnClick = typeof option.gridOnClick === 'function' ? option.gridOnClick : undefined;
    var styles = option.styles || {};
    this.leftHandWidth = styles.leftHandWidth || 40;
    this.Gheight = styles.Gheight || 48;
    this.defaultPalette = ['#f05261', '#48a8e4', '#ffd061', '#52db9a', '#70d3e6', '#52db9a', '#3f51b5', '#f3d147', '#4adbc3', '#673ab7', '#f3db49', '#76bfcd', '#b495e1', '#ff9800', '#8bc34a'];
    this.palette = (typeof styles.palette === 'boolean' && !styles.palett) ? false : (styles.palette || []).concat(this.defaultPalette)
    this._init();
  };
  Timetables.prototype = {
    _init: function (option) {
      var option = option || {};
      var style = option.styles || {};
      var gridOnClick = option.gridOnClick || this.gridOnClick;
      var merge = typeof option.merge === 'boolean' ? option.merge : this.merge;
      var highlightWeek = option.highlightWeek || this.highlightWeek;
      var leftHandText = this.leftHandText;
      var leftHandWidth = style.leftHandWidth || this.leftHandWidth;
      var Gheight = style.Gheight || this.Gheight;
      var palette;
      if (typeof style.palette === 'boolean' && !style.palette) {
        palette = false
      } else {
        palette = style.palette ? (style.palette || []).concat(this.defaultPalette) : this.palette;
      }
      if (!merge) {
        console.error("None-merge mode is not implemented.")
        return
      }

      var Timetables = option.timetables || this.Timetables;
      var week = option.week || this.week;
      var TimetableType = JSON.parse(JSON.stringify(option.timetableType || this.TimetableType));
      var deepCopyTimetableType = option.timetableType || this.TimetableType;
      var TimetableTypeLength = TimetableType.length;
      Timetables.forEach(function (item, index) {
        if (item.length < TimetableTypeLength) {
          for (var i = 0; i < TimetableTypeLength - item.length; i++) {
            item.push('');
          }
        }
      });
      if (option.setNewOption) {
        this.el.removeChild(this.el.childNodes[0]);
      }
      var courseWrapper = document.createElement('div');
      courseWrapper.id = 'courseWrapper';
      courseWrapper.style.position = 'relative';
      courseWrapper.style.paddingLeft = leftHandWidth + 'px';
      courseWrapper.style.border = '1px solid #dbdbdb';

      TimetableType.forEach(function (item, index) {
        item.unshift(index + 1)
      });

      var leftHand = document.createElement("div");
      leftHand.className = 'Courses-leftHand';
      leftHand.style.position = 'absolute';
      leftHand.style.left = 0;
      leftHand.style.top = 0;
      leftHand.style.width = leftHandWidth + 'px';

      var timetable = Timetables[0].map(function (v, i) {
        return [];
      });
      timetable.forEach(function (item, index) {
        Timetables.forEach(function (val, i) {
          timetable[index].push(val[index]);
        });
      });

      var listMerge = [];
      if (merge) {
        Timetables.forEach(function (list, i) {
          if (!listMerge[i]) {
            listMerge[i] = [];
          }
          list.forEach(function (item, index) {
            if (!index) {
              return listMerge[i].push({ name: item, length: 1 });
            }
            if (JSON.stringify(item) === JSON.stringify((listMerge[i][index - 1] || {}).name) && item) {
              var sameIndex = (listMerge[i][index - 1] || {}).sameIndex;
              if (sameIndex || sameIndex === 0) {
                listMerge[i][sameIndex].length++;
                return listMerge[i].push({ name: item, length: 0, sameIndex: sameIndex });
              }
              listMerge[i][index - 1].length++;
              return listMerge[i].push({ name: item, length: 0, sameIndex: index - 1 });
            } else {
              return listMerge[i].push({ name: item, length: 1 });
            }
          });
        });
      }

      var head = document.createElement("div");
      head.style.overflow = 'hidden';
      head.className = 'Courses-head';
      week.forEach(function (item, index) {
        var weekItem = document.createElement("div");
        var highlightClass = highlightWeek === (index + 1) ? 'highlight-week ' : '';
        weekItem.className = highlightClass + 'Courses-head-' + (index + 1);
        weekItem.innerText = item;
        weekItem.style.cssFloat = 'left';
        weekItem.style.boxSizing = 'border-box';
        weekItem.style.whiteSpace = 'nowrap';
        weekItem.style.width = 100 / week.length + '%'
        head.appendChild(weekItem);
      })
      courseWrapper.appendChild(head);

      var courseListContent = document.createElement("div");
      courseListContent.className = 'Courses-content';
      var paletteIndex = 0;
      timetable.forEach(function (values, index) {
        var courseItems = document.createElement("ul");
        courseItems.style.listStyle = 'none';
        courseItems.style.padding = '0px';
        courseItems.style.margin = '0px';
        courseItems.style.minHeight = Gheight + 'px';

        courseItems.className = 'stage_' + ((TimetableType[0] || [])[0] || 'none');
        --(TimetableType[0] || [])[2];
        if (!((TimetableType[0] || [])[2])) {
          TimetableType.shift();
        }
        values.forEach(function (item, i) {
          if (i > week.length - 1) return;
          var courseItem = document.createElement("li");
          courseItem.style.cssFloat = 'left';
          courseItem.style.width = 100 / week.length + '%';
          courseItem.style.height = Gheight + 'px';
          courseItem.style.boxSizing = 'border-box';
          courseItem.style.position = 'relative';
          if (merge) {
            if (listMerge[i][index].length >= 1) {
              if (typeof listMerge[i][index].name == 'string') {
                if (listMerge[i][index].name == '') listMerge[i][index].name = []
                else listMerge[i][index].name = [listMerge[i][index].name]
              }
              let mergeDomWidth = 100.0 / listMerge[i][index].name.length;
              for (let k = 0; k < listMerge[i][index].name.length; k++) {
                var mergeDom = document.createElement("span");
                mergeDom.style.position = 'absolute';
                mergeDom.style.zIndex = 9;
                mergeDom.style.width = mergeDomWidth + '%';
                mergeDom.style.height = Gheight * listMerge[i][index].length + 'px';
                mergeDom.style.left = (mergeDomWidth * k) + '%';
                mergeDom.style.top = 0;
                if (palette) {
                  mergeDom.style.backgroundColor = palette[paletteIndex];
                  mergeDom.style.color = '#fff';
                  paletteIndex++;
                  if (paletteIndex >= palette.length) {
                    paletteIndex = 0;
                  }
                }
                mergeDom.innerText = listMerge[i][index].name[k];
                mergeDom.className = 'course-hasContent'
                mergeDom.onclick = function() {
                  gridOnClick && gridOnClick(listMerge[i][index].name[k]);
                }
                courseItem.appendChild(mergeDom);
              }
            } else if (listMerge[i][index].length === 0) {
              courseItem.innerText = '';
            }
          } else {
            //TODO
            // if (item) {
            //   if (palette) {
            //     courseItem.style.backgroundColor = palette[paletteIndex];
            //     courseItem.style.color = '#fff';
            //     paletteIndex++;
            //     if (paletteIndex > palette.length) {
            //       paletteIndex = 0;
            //     }
            //   }
            //   courseItem.className = 'course-hasContent'
            //   courseItem.innerText = item
            // } else {
            //   courseItem.innerText = '';
            // }
          }

          // courseItem.onclick = function (e) {
          //   var allList = document.querySelectorAll('.Courses-content ul li').forEach(function (v, i) {
          //     v.classList.remove('grid-active');
          //   })
          //   this.className = 'grid-active';
          //   var info = {
          //     name: item,
          //     week: week[i],
          //     index: index + 1,
          //     length: merge ? listMerge[i][index].length : 1
          //   };
          //   gridOnClick && gridOnClick(info);
          // };
          courseItems.appendChild(courseItem);
        });
        courseListContent.appendChild(courseItems);
      })
      courseWrapper.appendChild(courseListContent);
      courseWrapper.appendChild(leftHand);
      this.el.appendChild(courseWrapper);

      var courseItemDomHeight = (document.querySelector('.stage_1 li') || document.querySelector('.stage_none li')).offsetHeight;
      var coursesHeadDomHeight = document.querySelector('.Courses-head').offsetHeight;

      var leftHandTextDom = document.createElement("div");
      leftHandTextDom.className = 'left-hand-TextDom';
      leftHandTextDom.style.height = coursesHeadDomHeight + 'px';
      leftHandTextDom.style.boxSizing = 'border-box';

      leftHandText.forEach(function (item) {
        var leftHandTextItem = document.createElement('div');
        leftHandTextItem.innerText = item;
        leftHandTextDom.appendChild(leftHandTextItem);
      })
      leftHand.appendChild(leftHandTextDom);

      deepCopyTimetableType.forEach(function (item, index) {
        var handItem = document.createElement("div");
        handItem.style.width = '100%';
        handItem.style.height = courseItemDomHeight * item[1] + 'px';
        handItem.style.boxSizing = 'border-box';
        if (typeof item[0] === 'object') {
          for (var v in item[0]) {
            var handItemInner = document.createElement('p');
            handItemInner.innerText = item[0][v];
            handItemInner.style.margin = '0px';
            handItemInner.className = 'left-hand-' + v;
            handItem.appendChild(handItemInner);
          }
        } else {
          handItem.innerText = item[0] || '';
        }
        handItem.className = 'left-hand-' + (index + 1);
        leftHand.appendChild(handItem);
      });
    },
    setOption: function (option) {
      (option || {}).setNewOption = true;
      this._init(option);
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = Timetables;
  if (typeof define === 'function') define(function () { return Timetables; });
  global.Timetables = Timetables;
})(this);
