angular.module('2048App', [])
    .controller('GameCtrl', ['$scope','Numbers', function($scope,Numbers) {
        $scope.data=new DataArray(4);
        for(var i=0;i<$scope.data.length;i++) {
            $scope.data[i] = new DataArray(4);
        }
        $scope.data[1][0]=4;
        $scope.data[1][1]=4;
        $scope.data[1][3]=2;
        $scope.do = function() {
            $scope.data.slideLeft();
        }
        $scope.moveTiles = function(keyEvent) {
            var key = keyEvent.which;
            if(key>=37 && key<=40) {
                if(key == 37) {
                    $scope.data.slideLeft();
                } else if(key == 38) {
                    $scope.data.slideUp();
                } else if(key == 39) {
                    $scope.data.slideRight();
                } else if(key == 40) {
                    $scope.data.slideDown();
                }
                var pos = Numbers.getNextRandomPos($scope.data);
                $scope.data[pos[0]][pos[1]] = Numbers.getNextNum();
            }
        }
    }]).
    factory('Numbers',[function() {
        return  {
            getNextNum : function() {
                var num = [2,4];
                var index = this.getRandomNumInRange(2);
                return num[index];
            },
            getNextRandomPos : function(data) {
                var count = 0;
                var indices = [];
                data.forEach(function(element) {
                    element.forEach(function(value) {
                        if(value===null)
                            indices.push(count);
                        count++;
                    });
                });
                var i = this.getRandomNumInRange(indices.length);
                var pos = [];
                if(indices.length>=0) {
                    var index = indices[i];
                    pos[1] = index%4;
                    pos[0] = Math.floor(index/4);
                }
                return pos;
                    
            },
            getRandomNumInRange : function(limit) {
                if(limit>0)
                    return Math.floor(Math.random()*10)%limit;
                else
                return 0;
            }
        }
    }]);
    
function DataArray(num) {
    this.length = num;
    for(var i=0;i<this.length;i++) {
        this[i]=null;
    }
}
DataArray.prototype = new Array();
DataArray.prototype.slideRight = function() {
    for(var row=0;row<this.length;row++) {
        this[row].rightShift();
        this[row].addRight();
        this[row].rightShift();
    }
}
DataArray.prototype.slideLeft = function() {
    for(var row=0;row<this.length;row++) {
        this[row].reverse();
        this[row].rightShift();
        this[row].addRight();
        this[row].rightShift();
        this[row].reverse();
    }
}
DataArray.prototype.slideDown = function() {
    for(var col=0;col<this[0].length;col++) {
        var column = new DataArray(this.length);
        for(var row=0;row<this.length;row++) {
            column[row] = this[row][col];
        }
        column.rightShift();
        column.addRight();
        column.rightShift();
        for(var row=0;row<this.length;row++) {
            this[row][col]=column[row];
        }
    }
}
DataArray.prototype.slideUp = function() {
    for(var col=0;col<this[0].length;col++) {
        var column = new DataArray(this.length);
        for(var row=0;row<this.length;row++) {
            column[row] = this[row][col];
        }
        column.reverse();
        column.rightShift();
        column.addRight();
        column.rightShift();
        column.reverse();
        for(var row=0;row<this.length;row++) {
            this[row][col]=column[row];
        }
    }
}
DataArray.prototype.addRight = function() {
    for(var i=this.length-1;i>0;i--) {
        if(this[i]!==null && this[i]===this[i-1]) {
            this[i-1]=null;
            this[i]*=2;
            i--;
        }
    }
}
DataArray.prototype.rightShift = function() {
    var vals = [];
    for(var i=0;i<this.length;i++) {
        if(this[i]!==undefined && this[i]!==null) {
            vals.push(this[i]);
        }
    }
    for(var i=this.length-1;i>=0;i--) {
        if(vals.length>0)
            this[i] = vals.pop();
        else
            this[i] = null;
    }
}
