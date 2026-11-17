% formulae for calculating volumes of regular solid shapes
function v = solid_volume(length,width,radius,height)
fprintf('solid figures:\n %d cube\n %d cuboid\n %d cylinder\n %d cone\n %d pyramid\n %d sphere\n',1:6)
n=input('Input the number of the solid volume: ');
switch n
    case 1
        if width==0 && height==0
            v=length^2;
        else 
            v=length*width*height;
        end
    case 2
        v=length*width*height;
    case 3
        v=pi*radius^2*height;
    case 4
        v=(1/3)*pi*radius^2*height;
    case 5
        v=length*width*(1/3)*height;
    case 6
        v=(4/3)*pi*radius^3;
end
fprintf('The volume of the solid figure is %.2fcm^%d\n',v,3)
end 