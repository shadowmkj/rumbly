%macro  write 2

mov eax , 4
mov ebx , 1
mov ecx , %1
mov edx , %2
int 80h

%endmacro


%macro read  2

mov eax , 3
mov ebx , 0
mov ecx , %1
mov edx , %2
int 80h

%endmacro


section .bss

num1 : resb 2
num2 : resb 2
res  : resb 2



section .data
msg1 : db "Enter the first number: " , 0AH
len1 : equ $ - msg1

msg2 : db "Enter the second number: " , 0AH
len2 : equ $ - msg2

msg3 : db " The result is: "
len3 : equ $-msg3

section .text

write msg1,len1
read num1 , 2

write msg2 ,len2
read num2 , 2


mov al , [num1]
sub al , '0'
mov bl , [num2]
sub bl , '0'

mul bl
add ax , '0'
mov [res] , ax

write msg3,len3
write res , 2

mov eax , 1
mov ebx , 0
int 80h



