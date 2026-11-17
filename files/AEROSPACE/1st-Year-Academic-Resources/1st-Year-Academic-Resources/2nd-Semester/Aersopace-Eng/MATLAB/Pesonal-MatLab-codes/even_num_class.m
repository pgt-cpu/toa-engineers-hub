clear 
close all
clc
x=input('Please enter a number: ');
if rem(x,2)==0''rem(x,3)==0
    disp('The number is divisible by 2 or 3')
elseif (rem(x,2)==0 && rem(x,3)==0)
    disp('The number is divisible by 2 and 3')
end
