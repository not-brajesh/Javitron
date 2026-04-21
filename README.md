

---

## 🔁 1. GCD using Recursion

```c
#include <stdio.h>

int gcd(int a, int b){
    if(b==0)
        return a;
    return gcd(b, a % b);
}

int main(){
    int a,b;
    scanf("%d %d",&a,&b);
    printf("GCD = %d\n", gcd(a,b));
    return 0;
}
```

---

## 🔗 2. String Length & Concatenation using Pointers

```c
#include <stdio.h>

int length(char *str){
    int count=0;
    while(*str!='\0'){
        count++;
        str++;
    }
    return count;
}

void concat(char *s1, char *s2){
    while(*s1!='\0') s1++;
    while(*s2!='\0'){
        *s1 = *s2;
        s1++;
        s2++;
    }
    *s1 = '\0';
}

int main(){
    char s1[100], s2[100];
    scanf("%s %s", s1, s2);

    printf("Length = %d\n", length(s1));

    concat(s1, s2);
    printf("Concatenated = %s\n", s1);

    return 0;
}
```

---

## 📊 3. Selection Sort

```c
#include <stdio.h>

int main(){
    int n,i,j,min,temp;
    scanf("%d",&n);

    int arr[n];

    for(i=0;i<n;i++) scanf("%d",&arr[i]);

    for(i=0;i<n-1;i++){
        min=i;
        for(j=i+1;j<n;j++){
            if(arr[j]<arr[min])
                min=j;
        }
        temp=arr[i];
        arr[i]=arr[min];
        arr[min]=temp;
    }

    for(i=0;i<n;i++) printf("%d ",arr[i]);

    return 0;
}
```

---

## 📊 4. Insertion Sort

```c
#include <stdio.h>

int main(){
    int n,i,j,key;
    scanf("%d",&n);

    int arr[n];

    for(i=0;i<n;i++) scanf("%d",&arr[i]);

    for(i=1;i<n;i++){
        key=arr[i];
        j=i-1;

        while(j>=0 && arr[j]>key){
            arr[j+1]=arr[j];
            j--;
        }
        arr[j+1]=key;
    }

    for(i=0;i<n;i++) printf("%d ",arr[i]);

    return 0;
}
```

---

## 📚 5. Stack using Pointers

```c
#include <stdio.h>
#include <stdlib.h>

struct node{
    int data;
    struct node *next;
};

struct node *top=NULL;

void push(int x){
    struct node *newnode = (struct node*)malloc(sizeof(struct node));
    newnode->data=x;
    newnode->next=top;
    top=newnode;
}

void pop(){
    if(top==NULL){
        printf("Underflow\n");
        return;
    }

    struct node *temp=top;
    printf("%d\n", temp->data);
    top=top->next;
    free(temp);
}

int main(){
    push(10);
    push(20);
    pop();
    pop();
    pop(); // test underflow

    return 0;
}
```

---

## 📚 6. Queue using Pointers

```c
#include <stdio.h>
#include <stdlib.h>

struct node{
    int data;
    struct node *next;
};

struct node *front=NULL,*rear=NULL;

void enqueue(int x){
    struct node *newnode=(struct node*)malloc(sizeof(struct node));
    newnode->data=x;
    newnode->next=NULL;

    if(rear==NULL){
        front=rear=newnode;
        return;
    }

    rear->next=newnode;
    rear=newnode;
}

void dequeue(){
    if(front==NULL){
        printf("Underflow\n");
        return;
    }

    struct node *temp=front;
    printf("%d\n", temp->data);
    front=front->next;

    if(front==NULL)
        rear=NULL;

    free(temp);
}

int main(){
    enqueue(10);
    enqueue(20);
    dequeue();
    dequeue();
    dequeue(); // test underflow

    return 0;
}
```

---

## 🔗 7. Singly Linked List (Create & Display)

```c
#include <stdio.h>
#include <stdlib.h>

struct node{
    int data;
    struct node *next;
};

struct node *head=NULL;

void create(int n){
    struct node *temp=NULL,*newnode;

    for(int i=0;i<n;i++){
        newnode=(struct node*)malloc(sizeof(struct node));
        scanf("%d",&newnode->data);
        newnode->next=NULL;

        if(head==NULL){
            head=temp=newnode;
        } else{
            temp->next=newnode;
            temp=newnode;
        }
    }
}

void display(){
    struct node *temp=head;
    while(temp!=NULL){
        printf("%d -> ",temp->data);
        temp=temp->next;
    }
    printf("NULL\n");
}

int main(){
    int n;
    scanf("%d",&n);

    create(n);
    display();

    return 0;
}
```

---

## 🔗 8. Delete First Node in Linked List

```c
#include <stdio.h>
#include <stdlib.h>

struct node{
    int data;
    struct node *next;
};

struct node *head = NULL;

void insert(int val){
    struct node *newnode = (struct node*)malloc(sizeof(struct node));
    newnode->data = val;
    newnode->next = NULL;

    if(head == NULL){
        head = newnode;
        return;
    }

    struct node *temp = head;
    while(temp->next)
        temp = temp->next;

    temp->next = newnode;
}

void deleteFirst(){
    if(head == NULL){
        printf("List Empty\n");
        return;
    }

    struct node *temp = head;
    head = head->next;
    free(temp);
}

void display(){
    struct node *temp = head;
    while(temp){
        printf("%d -> ", temp->data);
        temp = temp->next;
    }
    printf("NULL\n");
}

int main(){
    insert(10);
    insert(20);
    insert(30);

    display();

    deleteFirst();
    display();

    return 0;
}
```

---

## 🌳 9. Binary Tree Traversal (Inorder)

```c
#include <stdio.h>
#include <stdlib.h>

struct node{
    int data;
    struct node *left,*right;
};

struct node* create(int data){
    struct node* newnode=(struct node*)malloc(sizeof(struct node));
    newnode->data=data;
    newnode->left=newnode->right=NULL;
    return newnode;
}

void inorder(struct node* root){
    if(root){
        inorder(root->left);
        printf("%d ",root->data);
        inorder(root->right);
    }
}

int main(){
    struct node* root=create(1);
    root->left=create(2);
    root->right=create(3);

    inorder(root);

    return 0;
}
```

---

## 🌐 10. Graph Traversal (DFS & BFS)

```c
#include <stdio.h>

int graph[10][10], visited[10], n;

void dfs(int v){
    printf("%d ",v);
    visited[v]=1;

    for(int i=0;i<n;i++){
        if(graph[v][i] && !visited[i])
            dfs(i);
    }
}

void bfs(int v){
    int queue[10], front=0,rear=0;

    visited[v]=1;
    queue[rear++]=v;

    while(front<rear){
        int node=queue[front++];
        printf("%d ",node);

        for(int i=0;i<n;i++){
            if(graph[node][i] && !visited[i]){
                visited[i]=1;
                queue[rear++]=i;
            }
        }
    }
}

int main(){
    scanf("%d",&n);

    for(int i=0;i<n;i++)
        for(int j=0;j<n;j++)
            scanf("%d",&graph[i][j]);

    // DFS
    for(int i=0;i<n;i++) visited[i]=0;
    dfs(0);

    // BFS
    for(int i=0;i<n;i++) visited[i]=0;
    printf("\n");
    bfs(0);

    return 0;
}
```

---


👉 main isko **professional GitHub project (badges + folder structure)** bana deta hoon
👉 ya **viva questions + expected outputs** bhi de deta hoon
