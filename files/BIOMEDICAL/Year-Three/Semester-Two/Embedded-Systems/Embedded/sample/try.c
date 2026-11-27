#include<reg51.h>

void delay (unsigned int count)
{
unsigned int i;	
while (count)
	{
		i = 200;
		while (i > 0 )
			i--;
		count--;
	}
}


void main()
{
while (1)
{
	P1 = 0x00;
	delay(1000);
	P1 = 0xFF;
	delay(1000);
	
}	
}

