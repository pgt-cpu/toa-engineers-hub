% generating Fibonacci numbers coded by Ogyam.
function fibo
n=input('What nth term of the Fibonacci sequence do you want to find? ');
x=1; y=0;
for i=1:n
    r=rem(i,2);
    switch r
        case 1
            x=x+y;
        case 0
            y=x+y;
    end
end
if rem(n,2)==1
    fprintf('The fibonacci number is %d.\n',x)
else fprintf('The fibonacci number is %d.\n',y)
end