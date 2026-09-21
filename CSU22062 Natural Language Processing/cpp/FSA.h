#if !defined(FSA_h)
#define FSA_h


#include "Node.h"

//! a Finite State Automaton
class FSA {
 public:
  FSA(void);       //!< makes empty FSA to then add to with update
  char sep;        //!< what character to split input at

  /******************/
  /* ACCEPT METHODS */
  /******************/


  /* turns input into a vector key using sep as separator */
  bool accept(string input);   //!< test if input is accepted 

  /******************/
  /* UPDATE METHODS */
  /******************/

  void update(string input); //!< add to FSA to make input be accepted

  /******************/
  /* SHOW METHODS   */
  /******************/

  void show(void);
  void dot_show(void); 

 private:
  vector<NodePtr> initial_states; //!< lists all Nodes which are possible start points 
  vector<string> key; //!< the vector of strings which is used to traverse the FSA
  void set_key_from_string(string in); //!< set key by spliting string at the sep character

  bool accept(void);   //!< checks if key is accepted


};

#endif



