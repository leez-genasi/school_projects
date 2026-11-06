<?php
    session_start();
    include "dbconnect.php";
    if (isset($_POST['submit'])) {
        if (empty($_POST['username']) || empty($_POST['password'])) {
            $error = "Please fill in all records.";
        }
        else {
            $username = $_POST['username'];
            $password = $_POST['password'];
            $access = $dbcnx->query(
                "SELECT * FROM myusers WHERE username='$username' AND password='$password'"
            );

            if ($access -> num_rows>0) {
                $_SESSION['valid_user'] = $username;
                header("Location: updatePrice.php");
                echo "Login Successful";
            }
            else {
                $error = "Invalid credentials.";
            }
            $dbcnx->close();
        }
    }
?>

<html>
    <head>
        <link rel="stylesheet" href="stylesheet.css">
    </head>
    <body id="wrapper">
        <div class="header"; width=" 100%">
            <h1>JavaJam Coffee House</h1>   
        </div>
        <div class="content">
            <div class="nav">
                <p>
                    <a href="index.html">Home</a><br>
                    <a href="menu.php">Menu</a><br>
                    <a href="music.html">Music</a><br>
                    <a href="jobs.html">Jobs</a>
                </p>
            </div>
            <section class="login">
                <h3>Admin Login</h3>
                <form method="post">
                    <table><tbody>
                        <tr>
                            <td><label>Username:</label></td>
                            <td><input type="text" id="user" name="username"></td>
                        </tr>
                        <tr>
                            <td><label>Password:</label></td>
                            <td><input type="password" id="pw" name="password"></td>
                        </tr>
                        <tr><td colspan="2"><input type="submit" value="Log In" name="submit"></td></tr>
                        <?php
                            if (!empty($error)) { echo "<tr><td colspan='2' color='#ff0000'>" .$error ."</td></tr>"; }
                        ?>
                    </tbody></table>
                </form> 
            </section>
        </div>
        <div class="footer">
            <i>
                <p>Copyright &copy; 2024 JavaJam Coffee House<br>
                <a href="mailto:leec0160@e.ntu.edu.sg">charlette@lee.com</a></p>
            </i>
        </div>
    </body>
</html>