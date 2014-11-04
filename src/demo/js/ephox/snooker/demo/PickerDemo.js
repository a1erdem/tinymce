define(
  'ephox.snooker.demo.PickerDemo',

  [
    'ephox.snooker.picker.PickerUi',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.Insert',
    'ephox.sugar.api.Remove',
    'global!Math'
  ],

  function (PickerUi, Element, Insert, Remove, Math) {
    return function () {

      var picker = PickerUi({
        maxCols: 6,
        maxRows: 5,
        minCols: 1,
        minRows: 1
      }, 'ltr');
      var ephoxUi = Element.fromDom(document.getElementById('ephox-ui'));
      Remove.empty(ephoxUi);
      Insert.append(ephoxUi, picker.element());

      var val = 3;

      picker.setSize(10, 10);
      picker.setHeaders(1, 1);
      picker.setSelection(2, 2);

      picker.events.select.bind( function(event) {
        console.log('need to create table with ', event.cols(), 'columns and ', event.rows(), 'rows' );
        console.log('headers: ', event.rowHeaders() + ' x ' + event.columnHeaders());
      });


      picker.on();
    };
  }
);
