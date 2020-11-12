import { AbstractControl } from '@angular/forms';

function validateID(idNumber:String)
  {
    var evenSum = "";
    var oddSum = 0 ;
    let multiSum = 0 ;
    for(let i =0;i<idNumber.length-1;i++)
    {
      var numAtIndex = parseInt(idNumber[i]);
      if(i%2 ==0)
      {
        oddSum += numAtIndex;
      }
      else
      {
        evenSum += numAtIndex
      }
    }

    multiSum = parseInt(evenSum) * 2 ;
    let finalSum = 0 ;

    for(let i =0; i< multiSum.toString().length;i++)
    {
      var numAtIndex = parseInt(multiSum.toString()[i]);
      finalSum += numAtIndex;
    }
    if((oddSum + finalSum)%10==0)
    {
      return true;
    }
    return false;
  }

export function idNumberValidator(control: AbstractControl): {[key: string]: any}  | null{
    const isValid = validateID(control.value);
    return !isValid ? {'idValidation' : {value: control.value}} : null;
    
}