#if !defined(node_h)
#define node_h
#include <string>
#include <vector>
#include <iostream>

using namespace std;


class Node;  // forward declaratoin

//! NodePtr used as typedef in Node
typedef Node * NodePtr;

//! a helper class for Node representing a single arc out of a node
class Arc {
 public:
  string label; //!< the label on the arc
  NodePtr next; //!< the destination of the arc
};


//! represents a state in an FSA
class Node{
 public:
  Node(void);

  NodePtr update(string label);   //!< adds an Arc with new node target for given label 
  NodePtr match(string label);    //!< returns node target for given label 
  bool accept;  //!< is this an accept node 
  bool initial; //!< is this an initial node
  
  void show(void); //!< show this node and recursive descendents
  void show(ostream&); 
  string identifier; //!< used for debugging 

 private:
  vector<Arc> arcs; //!< the arcs going out of a node
  static int node_count; //!< used for debugging
};


#endif

