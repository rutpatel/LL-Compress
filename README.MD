# LOSSLESS DATA COMPRESSION

-Implemented Huffman's Algorithm

- Normal Space saving ~ 45% with an average compresion ratio of ~1.60

***************************************************

- Compression: The code Implements Huffman's Algorithm and generates a file (i.e. sample_compressed.txt) with the header section which has the mapping information used to regenarate the binary tree to efficiently decompress the file later. The latter part of the compressed file consist of bits (0's and 1's). Developers can use this code to create a compression software by encoding the bits as per their choice (8-bit, 16-bit or 32-bit) and saving it in a file with any extension name. 
- Decompression: the first number (say 'n') before first ',' is the total number of characters used in the original file. In the header part, there are n characters followed by their frequency of occurences in the original file sapareted by a ',' (i.e. e12, r4, y6). This is used to generate the binary tree again. 
Decode the latter part of the compressed file to get the bits and then decompress it using the binary tree. 

***************************************************

# License

Licensed under the [MIT License](LICENSE).
