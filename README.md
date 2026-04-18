Here’s your **clean, properly formatted README.md** (copy–paste ready):

---

# 📘 Data Structures & C Programs

This repository contains basic C programs for fundamental concepts like searching, stack, queue, linked list, recursion, etc.

---

## 🔍 1. Linear Search

```c
#include <stdio.h>
int main() {
    int n, i, key;
    scanf("%d", &n);
    int arr[n];

    for(i=0;i<n;i++) scanf("%d",&arr[i]);

    scanf("%d",&key);

    for(i=0;i<n;i++){
        if(arr[i]==key){
            printf("Found at %d", i+1);
            return 0;
        }
    }
    printf("Not Found");
}
```

---

## 🔍 2. Binary Search

```c
#include <stdio.h>
int main() {
    int n, i, key, low=0, high, mid;
    scanf("%d",&n);
    int arr[n];

    for(i=0;i<n;i++) scanf("%d",&arr[i]);

    scanf("%d",&key);

    high=n-1;

    while(low<=high){
        mid=(low+high)/2;

        if(arr[mid]==key){
            printf("Found at %d",mid+1);
            return 0;
        }
        else if(arr[mid]<key) low=mid+1;
        else high=mid-1;
    }
    printf("Not Found");
}
```

---

## 📚 3. Stack using Array

```c
#include <stdio.h>
#define MAX 5

int stack[MAX], top=-1;

void push(int x){
    if(top==MAX-1) printf("Overflow");
    else stack[++top]=x;
}

void pop(){
    if(top==-1) printf("Underflow");
    else printf("%d", stack[top--]);
}

int main(){
    push(10);
    push(20);
    pop();
}
```

---

## 📚 4. Queue using Array

```c
#include <stdio.h>
#define MAX 5

int q[MAX], front=-1, rear=-1;

void enqueue(int x){
    if(rear==MAX-1) printf("Overflow");
    else{
        if(front==-1) front=0;
        q[++rear]=x;
    }
}

void dequeue(){
    if(front==-1 || front>rear) printf("Underflow");
    else printf("%d", q[front++]);
}

int main(){
    enqueue(10);
    enqueue(20);
    dequeue();
}
```

---

## 🔗 5. Linked List (Create & Display)

```c
#include <stdio.h>
#include <stdlib.h>

struct node{
    int data;
    struct node *next;
};

struct node *head=NULL;

void create(int n){
    struct node *temp,*newnode;

    for(int i=0;i<n;i++){
        newnode=(struct node*)malloc(sizeof(struct node));
        scanf("%d",&newnode->data);
        newnode->next=NULL;

        if(head==NULL) head=temp=newnode;
        else{
            temp->next=newnode;
            temp=newnode;
        }
    }
}

void display(){
    struct node *temp=head;
    while(temp!=NULL){
        printf("%d->",temp->data);
        temp=temp->next;
    }
}

int main(){
    int n;
    scanf("%d",&n);
    create(n);
    display();
}
```

---

## 🔄 6. Reverse Array

```c
#include <stdio.h>
int main() {
    int n, i;
    scanf("%d", &n);
    int arr[n];

    for(i=0;i<n;i++) scanf("%d",&arr[i]);

    for(i=n-1;i>=0;i--) printf("%d ", arr[i]);
}
```

---

## 📊 7. Max & Min in Array

```c
#include <stdio.h>
int main() {
    int n, i, max, min;
    scanf("%d",&n);
    int arr[n];

    for(i=0;i<n;i++) scanf("%d",&arr[i]);

    max = min = arr[0];

    for(i=1;i<n;i++){
        if(arr[i]>max) max=arr[i];
        if(arr[i]<min) min=arr[i];
    }

    printf("Max=%d Min=%d", max, min);
}
```

---

## 🔁 8. Factorial (Recursion)

```c
#include <stdio.h>

int fact(int n){
    if(n==0 || n==1)
        return 1;
    else
        return n * fact(n-1);
}

int main(){
    int n;
    scanf("%d",&n);
    printf("%d", fact(n));
}
```

---

## 🔁 9. Fibonacci (Recursion)

```c
#include <stdio.h>

int fib(int n){
    if(n==0) return 0;
    if(n==1) return 1;
    return fib(n-1) + fib(n-2);
}

int main(){
    int n,i;
    scanf("%d",&n);

    for(i=0;i<n;i++)
        printf("%d ", fib(i));
}
```

---

## 🔁 10. Sum of Digits (Recursion)

```c
#include <stdio.h>

int sum(int n){
    if(n==0)
        return 0;
    else
        return (n%10) + sum(n/10);
}

int main(){
    int n;
    scanf("%d",&n);
    printf("%d", sum(n));
}
```

---

## 🔁 11. Reverse Number (Recursion)

```c
#include <stdio.h>

int rev(int n, int r){
    if(n==0)
        return r;
    else
        return rev(n/10, r*10 + n%10);
}

int main(){
    int n;
    scanf("%d",&n);
    printf("%d", rev(n,0));
}
```

---

## 🔁 12. Power of Number (Recursion)

```c
#include <stdio.h>

int power(int a, int b){
    if(b==0)
        return 1;
    else
        return a * power(a, b-1);
}

int main(){
    int a,b;
    scanf("%d %d",&a,&b);
    printf("%d", power(a,b));
}
```

---

✅ **Done — clean, structured, GitHub-ready README**

If you want, I can make it **🔥 premium GitHub style (badges + table + navigation + output examples)** — just tell me.
