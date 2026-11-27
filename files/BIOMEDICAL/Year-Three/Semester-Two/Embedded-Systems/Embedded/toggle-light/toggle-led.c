#include <reg51.h>
void main ()
{
unsigned char x,y; //  to help cos we need two variables
unsigned int i; // for the delay
	while (1)
	{
		x=0x01; // binary form is 00000001 b
		for (y=0;y<8;y++)
		{
			P1=x;
			for (i=0;i<6000;i++);
			x=x<<1;
		}
		
	}
	
	
}
