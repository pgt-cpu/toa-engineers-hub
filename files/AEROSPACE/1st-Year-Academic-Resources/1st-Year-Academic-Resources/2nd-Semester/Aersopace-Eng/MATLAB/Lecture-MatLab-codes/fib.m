clear
clc

n = input('input number > 2: ');
fibb = [1 1];
for i=3:n
    fibb(i) = fibb(i-1) + fibb(i-2);
end
disp (fibb)
