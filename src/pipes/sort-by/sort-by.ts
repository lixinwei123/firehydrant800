import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortBy',
})
export class SortByPipe implements PipeTransform {

  transform(array: Array<any>, stringArray:Array<string>) {

  	var path = stringArray[0];
  	var direction = stringArray[1];

  	if (array == null) {
      return null;
    }

    if(direction == 'smallest'){
    	array.sort((a: any, b: any) => {
	        if (a[path] < b[path] ){
	        //a is the Object and args is the orderBy condition (data.likes.count in this case)
	            return -1;
	        }else if( a[path] > b[path] ){
	            return 1;
	        }else{
	            return 0;
	        }
    	});
    }

    if(direction == 'largest'){
    	array.sort((a: any, b: any) => {
	        if (a[path] < b[path] ){
	        //a is the Object and args is the orderBy condition (data.likes.count in this case)
	            return 1;
	        }else if( a[path] > b[path] ){
	            return -1;
	        }else{
	            return 0;
	        }
    	});
    }


    return array;
  }
}
