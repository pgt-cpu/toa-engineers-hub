a=zeros(3,4);
for i=1:3
    for j=1:4
        a(i,j)=i+j
    end
end
disp('The 3 by 4 matrix is')
disp(a)