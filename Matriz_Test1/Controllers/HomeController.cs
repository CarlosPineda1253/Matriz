using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;


namespace Matriz_Test1.Controllers
{
    public class HomeController : Controller
    {
        int rows;
        int columns;

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        public IActionResult Error()
        {
            return View();
        }

        [HttpPost]
        public IActionResult rotate(string OMatrix)
        {
            string[,] matrix = JsonConvert.DeserializeObject<string[,]>(OMatrix);
            rows = matrix.GetLength(0);
            columns = matrix.GetLength(1);

            string[,] ret_matrix;

            //Solo se evalua si se trata de una matriz cuadrada o no
            if (rows == columns)
            {
                ret_matrix = Rotate_Square_Matrix(matrix);
            }
            else
            {
                ret_matrix = Rotate_Matrix(matrix);
            }
            //Codificamos el resultado de la matriz en JSON
            return Json(ret_matrix);
        }

        private string[,] Rotate_Matrix(string[,] matrix)
        {
            string[,] matrix_rotate = new string[columns, rows];

            /*Se evalua si las filas son mayores o menores, eso es por que si se rota el número de filas cambiara al número de
             * columas y viceversa (rot(mxn) = nxm) y al momento de leer los elementos en algun caso estariamos fuera del array
             * Cabe aclarar que los for's son iguales y el if podria ir dentro pero eso repercute en el rendimiento de CPU
             * y es mejor obtar por un código más grande en este caso*/
            if (rows > columns)
            {
                for (int i = 0; i < columns; i++)
                {
                    for (int z = 0; z < rows; z++)
                    {
                        /*Si las filas son más que las columnas se lee el elemento [num_filas][0](ósea que se lee el ultimo 
				         * elemento de las filas en la primera columna, el menos uno solo es por que iniciamos con el 0) al 
				         * inicio y se guarda en [0][0], así sucesivamente, quiere decir que vamos a pasar la primera fila 
				         * en la primera columna, cuando se repite el loop para las columnases el mismo proceso de pasar 
				         * columnas a las filas*/
                        matrix_rotate[i, z] = matrix[rows - z - 1, i];
                    }
                }
            }
            else
            {
                for (int i = 0; i < columns; i++)
                {
                    for (int z = 0; z < rows; z++)
                    {
                        /*Si las columnas son más que las filas se lee el elemento [0][num_columnas](ósea que se lee el ultimo 
                         * elemento de las columnas en la primera fila, el menos uno solo es por que iniciamos con el 0) al 
                         * inicio y se guarda en [num_columnas][num_filas] (pero tener claro que la primera dimensión 
                         * indica las filas y la segunda son las columnas), quiere decir que vamos a tomar la ultima columna
                         * y la vamos a convertir en la ultima fila, así lo mismo para las demás columnas*/
                        matrix_rotate[columns - i - 1, rows - z - 1] = matrix[z, columns - i - 1];
                    }
                }
            }

            return matrix_rotate;
        }

        private string[,] Rotate_Square_Matrix(string[,] matrix)
        {

            string[,] square_matrix = matrix;

            /*Se calcula los niveles que tiene la matriz con filas / 2 */
            int levels = (int)rows / 2;

            for (int i = 0; i < levels; i++)
            {
                /*La posicion inicial indica el elemento en que podemos empezar a rotar dependiendo de la capa, la posición 
                 * final indica  la ultima posición que podemos rotar, no importa si es fila o columna ya que mxn = nxn, el
                 * menos uno solo es por que iniciamos desde 0*/
                int pos_init = i;
                int pos_last = rows - pos_init - 1;

                for (int z = pos_init; z < pos_last; z++)
                {
                    /*La posición inidca en que posición nos encotramos en este momento*/
                    int position = z - pos_init;

                    /*Se guardan solo 2 valores para poder trabajar directamente con matriz, como top al principio de todo es el
                     * elemento [0][0] se guarda para poder sobreescribir su valor y posterior pasarlo a [0][n], al igual bottom
                     * al principio de todo es [n][n] se guarda y se pasa a [n][0]. Así para cada "top" [0...n-pos][n-pos] que va 
                     * [n...0][n-pos] y para cada "bottom" [n-pos][n-pos...0] que va a [n-pos][0...n-pos]*/
                    string top = square_matrix[pos_init, z];
                    string bottom = square_matrix[pos_last, pos_last - position];

                    /*Al igual que top y bottom se rotan, se hace lo mismo con los elementos contrarios a top y bottom, pero 
                     * no es necesario guardarlos en variables ya que se pueden escribir sin perder algun dato por que ya se
                     * guardaro en top y bottom*/
                    square_matrix[pos_init, z] = square_matrix[pos_last - position, pos_init];
                    square_matrix[pos_last, pos_last - position] = square_matrix[z, pos_last];
                    square_matrix[z, pos_last] = top;
                    square_matrix[pos_last - position, pos_init] = bottom;
                }
            }

            return square_matrix;
        }

    }
}
