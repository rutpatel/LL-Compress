# LOSSLESS DATA COMPRESSION

-Implemented Huffman's Algorithm

- Normal Space saving ~ 45% with an average compresion ratio of ~1.60

***************************************************

- The code Implements Huffman's Algorithm and produces a file (i.e. sample_compressed.txt) which has the header section which has the mappiing information which is used to regenarate the binary tree again to efficiently decompress the file later. The latter part of the compressed file consist of bits (0's and 1's). Developers can use this code to create a compression software by encoding the bits as per their choice (8-bits, 16-bits or 32-bits) and saving it in a file with any extension name. 
- For Decompression: the first number (say 'n') before first ',' is the total number of characters used in the original file. In header part, there is a character followed by it's frequency (i.e. e12, r4, y6) which is used to generate the binary tree again. Decode the latter part of the compressed file to get the bits and then decompress it using the binary tree. 

***************************************************

# License

Licensed under the [MIT License](LICENSE).
