/*!
 * # Fomantic-UI - Alert Plugin
 * http://github.com/fomantic/Fomantic-UI/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;
'use strict';

class fuialert {
  constructor(parameters) {
    return new Promise((resolve, reject) => {
      if ($.fn.modal == undefined) {
        reject("The FUI Modal module is required !");
      }

      this._parameters = ( $.isPlainObject(parameters) )
        ? $.extend(true, {}, FUIALERT_PARAMETERS, parameters)
        : $.extend({}, FUIALERT_PARAMETERS)
      ;

      this.$modal = this._build_layout();

      this.$modal.modal({
        multiple: true,
        closable: this._parameters.allowOutsideClick,
        transition: this._parameters.transition,
        onDeny: () => {
          resolve({
            isConfirmed: false,
            isDenied: true,
            value: false,
            dismiss: 'todo'
          });
        },
        onApprove: () => {
          let returnValue = true;

          let input = this.$modal.find('.fuialert-input');

          if (input.length) {
            returnValue = $(input[0]).val();
          }

          resolve({
            isConfirmed: true,
            isDenied: false,
            value: returnValue
          });
        },
        onHidden: () => {
          // Destroy the modal
          this.$modal.remove();
        }
      }).modal('show');
    });
  }

  static fire(parameters) {
    return new fuialert(parameters);
  }

  _build_layout() {
    let $target = $(this._parameters.target);

    // Create the modal object
    let $modal = $('<div/>', {
      class: `ui ${this._parameters.size} ${this._parameters.position !== 'centered' ? this._parameters.position + ' aligned' : ''} modal`
    }).attr('id', Date.now());

    // Create the header
    if (this._parameters.title != '') {
      // let $header = $('<div/>', {class: 'header'});

      // if (this._parameters.icon == undefined) {
      //   $header.html(this._parameters.title);
      // } else {
      //   $header.addClass('ui icon').append(`<i class="${this._parameters.icon} icon"></i>`);

      //   $header.append($('<div/>', {class: 'header'}).html(this._parameters.title));
      // }

      let $header = $('<div/>').addClass('header').html((this._parameters.icon == undefined ? '' : `<i class="${this._parameters.icon} icon"></i> `) + this._parameters.title);

      $modal.append($header);
    }

    let $content = '';

    // Create the content
    if (this._parameters.text != '') {
      $content = $('<div/>', {class: 'content'}).text(this._parameters.text);
    } else if (this._parameters.html != '') {
      $content = $('<div/>', {class: 'content'}).html(this._parameters.html);
    }

    if (this._parameters.input !== undefined) {
      let $inputDiv = $('<div/>');

      switch(this._parameters.input) {
        case 'text':
        let $input = $('<input class="fuialert-input" type="text"/>');
        $inputDiv.addClass('ui fluid input').append($input);
        break;
      }

      if ($content == '') {
        $content = $('<div/>', {class: 'content'});
      }

      $inputDiv.appendTo($content);
    }

    $modal.append($content);

    // Create the action buttons
    let $actions = $('<div/>', {class: 'actions'});

    if (this._parameters.showCancelButton) {
      let $cancelButton = $('<div/>', {class: `ui ${this._parameters.cancelButtonColor} deny button`});
      
      if (this._parameters.cancelButtonIcon !== undefined) {
        let $icon = $('<i/>', {class: `${this._parameters.cancelButtonIcon} icon`});

        $cancelButton.addClass('labeled icon').text(this._parameters.cancelButtonText).prepend($icon);
      } else {
        $cancelButton.text(this._parameters.cancelButtonText);
      }

      $actions.append($cancelButton);
    }

    if (this._parameters.showConfirmButton) {
      let $approveButton = $('<div/>', {class: `ui ${this._parameters.confirmButtonColor} approve button`});

      if (this._parameters.confirmButtonIcon !== undefined) {
        let $icon = $('<i/>', {class: `${this._parameters.confirmButtonIcon} icon`});

        $approveButton.addClass('labeled icon').text(this._parameters.confirmButtonText).prepend($icon);
      } else {
        $approveButton.text(this._parameters.confirmButtonText);
      }

      $actions.append($approveButton);
    }

    $modal.append($actions);

    $($target).append($modal);

    return $modal;
  }
}

const FUIALERT_PARAMETERS = {
  title              : '',
  text               : '',
  html               : '',
  icon               : undefined,
  target             : 'body',
  size               : true,
  showConfirmButton  : true,
  confirmButtonText  : 'OK',
  confirmButtonColor : 'primary',
  confirmButtonIcon  : undefined,
  showCancelButton   : false,
  cancelButtonText   : 'Cancel',
  cancelButtonColor  : 'grey',
  cancelButtonIcon   : undefined,
  allowOutsideClick  : true,
  position           : 'center',
  transition         : 'scale',
  input              : undefined
};
    